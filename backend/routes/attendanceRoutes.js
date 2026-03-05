const express = require('express');
const router = express.Router();
const {
  createAttendance,
  getAttendance,
  getMemberAttendance,
  bulkCreateAttendance,
} = require('../controllers/attendanceController');

router.route('/').get(getAttendance).post(createAttendance);
router.route('/bulk').post(bulkCreateAttendance);
router.route('/member/:id').get(getMemberAttendance);

module.exports = router;
