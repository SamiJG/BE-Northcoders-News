const express = require('express');
const topicsRouter = express.Router();
const {
  getAllTopics,
  getAllArticlesForTopic
} = require('../controllers/topics');

topicsRouter.route('/').get(getAllTopics);
topicsRouter.route('/:topic/articles').get(getAllArticlesForTopic);

module.exports = topicsRouter;
