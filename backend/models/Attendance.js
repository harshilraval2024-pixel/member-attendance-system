const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Member ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      required: [true, 'Attendance status is required'],
      enum: {
        values: ['present', 'absent'],
        message: 'Status must be either present or absent',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: prevent duplicate attendance for same member on same date
attendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

// Index for efficient querying
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ memberId: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
