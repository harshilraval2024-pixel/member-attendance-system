const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

// @desc    Record attendance
// @route   POST /api/attendance
exports.createAttendance = async (req, res, next) => {
  try {
    const { memberId, date, status } = req.body;

    // Verify member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    // Normalize date to start of day to prevent duplicates
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Check for duplicate
    const existing = await Attendance.findOne({
      memberId,
      date: normalizedDate,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Attendance already recorded for this member on this date',
      });
    }

    const attendance = await Attendance.create({
      memberId,
      date: normalizedDate,
      status,
    });

    const populated = await attendance.populate('memberId', 'firstName surname');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
exports.getAttendance = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      status,
      sortBy = 'date',
      order = 'desc',
    } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (status && ['present', 'absent'].includes(status)) {
      query.status = status;
    }

    const total = await Attendance.countDocuments(query);
    const records = await Attendance.find(query)
      .populate('memberId', 'firstName surname')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance for a specific member
// @route   GET /api/attendance/member/:id
exports.getMemberAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ memberId: req.params.id })
      .sort({ date: -1 })
      .populate('memberId', 'firstName surname');

    const totalRecords = records.length;
    const presentDays = records.filter((r) => r.status === 'present').length;
    const absentDays = records.filter((r) => r.status === 'absent').length;
    const attendanceRate = totalRecords > 0 ? ((presentDays / totalRecords) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        records,
        stats: {
          totalRecords,
          presentDays,
          absentDays,
          attendanceRate: parseFloat(attendanceRate),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk record attendance (multiple members at once)
// @route   POST /api/attendance/bulk
exports.bulkCreateAttendance = async (req, res, next) => {
  try {
    const { date, records } = req.body; // records: [{ memberId, status }]

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Records array is required and must not be empty',
      });
    }

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const results = [];
    const errors = [];

    for (const record of records) {
      try {
        const existing = await Attendance.findOne({
          memberId: record.memberId,
          date: normalizedDate,
        });

        if (existing) {
          // Update existing
          existing.status = record.status;
          await existing.save();
          results.push(existing);
        } else {
          const attendance = await Attendance.create({
            memberId: record.memberId,
            date: normalizedDate,
            status: record.status,
          });
          results.push(attendance);
        }
      } catch (err) {
        errors.push({ memberId: record.memberId, error: err.message });
      }
    }

    res.status(201).json({
      success: true,
      data: { created: results.length, errors },
    });
  } catch (error) {
    next(error);
  }
};
