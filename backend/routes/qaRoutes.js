const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  deleteAnswer,
  acceptAnswer,
  upvoteQuestion,
  getAllTags,
} = require('../controllers/qaController');

router.route('/tags/all').get(getAllTags);
router.route('/').get(getQuestions).post(createQuestion);
router.route('/:id').get(getQuestion).put(updateQuestion).delete(deleteQuestion);
router.route('/:id/upvote').patch(upvoteQuestion);
router.route('/:id/answers').post(addAnswer);
router.route('/:id/answers/:answerId').delete(deleteAnswer);
router.route('/:id/answers/:answerId/accept').patch(acceptAnswer);

module.exports = router;
