const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    surname: {
      type: String,
      required: [true, 'Surname is required'],
      trim: true,
      maxlength: [50, 'Surname cannot exceed 50 characters'],
    },
    fatherName: {
      type: String,
      required: [true, 'Father name is required'],
      trim: true,
      maxlength: [50, 'Father name cannot exceed 50 characters'],
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['studying', 'working'],
        message: 'Status must be either studying or working',
      },
    },
    studyField: {
      type: String,
      trim: true,
      maxlength: [100, 'Field of study cannot exceed 100 characters'],
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    skills: {
      type: [String],
      default: [],
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: [100, 'Occupation cannot exceed 100 characters'],
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
memberSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.surname}`;
});

// Index for search
memberSchema.index({ firstName: 'text', surname: 'text', occupation: 'text' });

// Ensure virtuals are included in JSON
memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Member', memberSchema);
