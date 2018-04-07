const { Topic, Article, Comment } = require('../models');

function getAllTopics(req, res, next) {
  Topic.find()
    .then(topics => res.send({ topics }))
    .catch(next);
}

function getAllArticlesForTopic(req, res, next) {
  Article.find({ topic: req.params.topic })
    .populate('created_by', 'username')
    .then(articles => {
      return Promise.all([articles, Comment.find()]);
    })
    .then(([articleDocs, comments]) => {
      const commentCount = comments.reduce((acc, comment) => {
        const username = comment.belongs_to;
        acc[username] ? acc[username]++ : (acc[username] = 1);
        return acc;
      }, {});
      return articleDocs.map(article => {
        return {
          title: article.title,
          body: article.body,
          topic: article.topic,
          created_by: article.created_by.username,
          votes: article.votes,
          comments: commentCount[article._id],
          _id: article._id
        };
      });
    })
    .then(articles => res.send({ articles }))
    .catch(next);
}

module.exports = { getAllTopics, getAllArticlesForTopic };
