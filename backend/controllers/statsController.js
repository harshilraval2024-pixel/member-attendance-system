const Member = require('../models/Member');
const Attendance = require('../models/Attendance');

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Total members
    const totalMembers = await Member.countDocuments();

    // Total attendance records
    const totalAttendance = await Attendance.countDocuments();

    // Average attendance rate
    const attendanceAgg = await Attendance.aggregate([
      {
        $group: {
          _id: null,
          totalPresent: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
    ]);

    const avgAttendanceRate =
      attendanceAgg.length > 0
        ? ((attendanceAgg[0].totalPresent / attendanceAgg[0].total) * 100).toFixed(1)
        : 0;

    // Most active members (most present days)
    const mostActive = await Attendance.aggregate([
      { $match: { status: 'present' } },
      { $group: { _id: '$memberId', presentDays: { $sum: 1 } } },
      { $sort: { presentDays: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'members',
          localField: '_id',
          foreignField: '_id',
          as: 'member',
        },
      },
      { $unwind: '$member' },
      {
        $project: {
          _id: 1,
          presentDays: 1,
          firstName: '$member.firstName',
          surname: '$member.surname',
        },
      },
    ]);

    // Weekly attendance trend (last 12 weeks)
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

    const weeklyTrend = await Attendance.aggregate([
      { $match: { date: { $gte: twelveWeeksAgo } } },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$date' },
            week: { $isoWeek: '$date' },
          },
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

    // Monthly attendance trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrend = await Attendance.aggregate([
      { $match: { date: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Skills distribution
    const skillsDistribution = await Member.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Study vs Job distribution
    const statusDistribution = await Member.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        totalAttendance,
        avgAttendanceRate: parseFloat(avgAttendanceRate),
        mostActive,
        weeklyTrend,
        monthlyTrend,
        skillsDistribution,
        statusDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member-specific statistics
// @route   GET /api/stats/member/:id
exports.getMemberStats = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    const records = await Attendance.find({ memberId: req.params.id }).sort({ date: -1 });

    const totalRecords = records.length;
    const presentDays = records.filter((r) => r.status === 'present').length;
    const absentDays = records.filter((r) => r.status === 'absent').length;
    const efficiency = totalRecords > 0 ? ((presentDays / totalRecords) * 100).toFixed(1) : 0;

    // Weekly participation (grouped)
    const weeklyParticipation = await Attendance.aggregate([
      {
        $match: {
          memberId: member._id,
        },
      },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$date' },
            week: { $isoWeek: '$date' },
          },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      { $limit: 12 },
    ]);

    // Attendance history (last 30 records)
    const attendanceHistory = records.slice(0, 30).map((r) => ({
      date: r.date,
      status: r.status,
    }));

    res.status(200).json({
      success: true,
      data: {
        member,
        stats: {
          totalRecords,
          presentDays,
          absentDays,
          efficiency: parseFloat(efficiency),
        },
        weeklyParticipation,
        attendanceHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};
