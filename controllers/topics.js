const { Topic, Article } = require('../models');

function getAllTopics(req, res, next) {
  Topic.find()
    .then(topics => res.send({ topics }))
    .catch(next);
}

function getAllArticlesForTopic(req, res, next) {
  Article.find({ topic: req.params.topic })
    .then(articles => res.send({ articles }))
    .catch(next);
}

module.exports = { getAllTopics, getAllArticlesForTopic };
