const express = require('express');
const articlesRouter = express.Router();
const {
  getAllArticles,
  getAllCommentsForArticle
} = require('../controllers/articles');

articlesRouter.route('/').get(getAllArticles);

articlesRouter.route('/:article_id/comments').get(getAllCommentsForArticle);

module.exports = articlesRouter;
