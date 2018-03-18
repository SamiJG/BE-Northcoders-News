const express = require('express');
const articlesRouter = express.Router();
const {
  getAllArticles,
  getAllCommentsForArticle,
  addCommentToArticle,
  voteOnArticle
} = require('../controllers/articles');

articlesRouter.route('/').get(getAllArticles);

articlesRouter
  .route('/:article_id/comments')
  .get(getAllCommentsForArticle)
  .post(addCommentToArticle);

articlesRouter.route('/:article_id').put(voteOnArticle);

module.exports = articlesRouter;
