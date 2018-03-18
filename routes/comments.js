const express = require('express');
const commentsRouter = express.Router();
const {
  getAllComments,
  voteOnComment,
  deleteComment
} = require('../controllers/comments');

commentsRouter.route('/').get(getAllComments);

commentsRouter
  .route('/:comment_id')
  .put(voteOnComment)
  .delete(deleteComment);

module.exports = commentsRouter;
