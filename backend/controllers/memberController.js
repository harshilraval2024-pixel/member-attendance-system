const Member = require('../models/Member');

// @desc    Create a new member
// @route   POST /api/members
exports.createMember = async (req, res, next) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members (with search & pagination)
// @route   GET /api/members
exports.getMembers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      skill,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { surname: { $regex: search, $options: 'i' } },
        { occupation: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && ['studying', 'working'].includes(status)) {
      query.status = status;
    }

    // Filter by skill
    if (skill) {
      query.skills = { $in: [skill] };
    }

    const total = await Member.countDocuments(query);
    const members = await Member.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: members,
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

// @desc    Get single member
// @route   GET /api/members/:id
exports.getMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
exports.updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    // Also delete attendance records for this member
    const Attendance = require('../models/Attendance');
    await Attendance.deleteMany({ memberId: req.params.id });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique skills across members
// @route   GET /api/members/skills/all
exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Member.distinct('skills');
    res.status(200).json({ success: true, data: skills.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};
