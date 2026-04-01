const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Answer body is required'],
      trim: true,
      maxlength: [2000, 'Answer cannot exceed 2000 characters'],
    },
    author: {
      type: String,
      trim: true,
      default: 'Admin',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      trim: true,
      maxlength: [5000, 'Question body cannot exceed 5000 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      trim: true,
      default: 'Admin',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['open', 'answered', 'closed'],
      default: 'open',
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

questionSchema.index({ title: 'text', body: 'text', tags: 'text' });
questionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema);
