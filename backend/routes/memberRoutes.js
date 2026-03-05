const express = require('express');
const router = express.Router();
const {
  createMember,
  getMembers,
  getMember,
  updateMember,
  deleteMember,
  getAllSkills,
} = require('../controllers/memberController');

router.route('/skills/all').get(getAllSkills);
router.route('/').get(getMembers).post(createMember);
router.route('/:id').get(getMember).put(updateMember).delete(deleteMember);

module.exports = router;
