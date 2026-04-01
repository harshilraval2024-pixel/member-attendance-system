const Question = require('../models/Question');

// @desc    Get all questions (with search, tag filter, pagination)
// @route   GET /api/qa
exports.getQuestions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      tag = '',
      status = '',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (status && ['open', 'answered', 'closed'].includes(status)) {
      query.status = status;
    }

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('-answers.body -answers.author'); // lightweight list view

    res.status(200).json({
      success: true,
      data: questions,
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

// @desc    Get single question (increments view count)
// @route   GET /api/qa/:id
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a question
// @route   POST /api/qa
exports.createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a question
// @route   PUT /api/qa/:id
exports.updateQuestion = async (req, res, next) => {
  try {
    const { answers, ...updateData } = req.body; // prevent accidental answers override
    const question = await Question.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a question
// @route   DELETE /api/qa/:id
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Add an answer to a question
// @route   POST /api/qa/:id/answers
exports.addAnswer = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    question.answers.push(req.body);
    if (question.status === 'open') {
      question.status = 'answered';
    }
    await question.save();
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an answer
// @route   DELETE /api/qa/:id/answers/:answerId
exports.deleteAnswer = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    question.answers = question.answers.filter(
      (a) => a._id.toString() !== req.params.answerId
    );
    if (question.answers.length === 0 && question.status === 'answered') {
      question.status = 'open';
    }
    await question.save();
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept an answer
// @route   PATCH /api/qa/:id/answers/:answerId/accept
exports.acceptAnswer = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    question.answers.forEach((a) => {
      a.isAccepted = a._id.toString() === req.params.answerId;
    });
    question.status = 'answered';
    await question.save();
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a question
// @route   PATCH /api/qa/:id/upvote
exports.upvoteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique tags
// @route   GET /api/qa/tags/all
exports.getAllTags = async (req, res, next) => {
  try {
    const tags = await Question.distinct('tags');
    res.status(200).json({ success: true, data: tags.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};
