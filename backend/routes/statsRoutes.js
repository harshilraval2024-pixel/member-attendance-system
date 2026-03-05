const express = require('express');
const router = express.Router();
const { getDashboardStats, getMemberStats } = require('../controllers/statsController');

router.route('/dashboard').get(getDashboardStats);
router.route('/member/:id').get(getMemberStats);

module.exports = router;
