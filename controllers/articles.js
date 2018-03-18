const mongoose = require('mongoose');
const { Article, Comment, User } = require('../models');

function getAllArticles(req, res, next) {
  Article.find()
    .populate('created_by', 'username')
    .then(articles => res.send({ articles }))
    .catch(next);
}
function getAllCommentsForArticle(req, res, next) {
  const { article_id } = req.params;
  Article.findOne({ _id: mongoose.Types.ObjectId(article_id) })
    .populate('created_by', 'username')
    .then(article => {
      return Promise.all([
        article,
        Comment.find({
          belongs_to: mongoose.Types.ObjectId(article_id)
        })
          .populate('created_by', 'username')
          .populate('belongs_to', 'title')
      ]);
    })
    .then(([article, comments]) => res.send({ article, comments }))
    .catch(next);
}

function addCommentToArticle(req, res, next) {
  User.findOne().then(user => {
    const newComment = new Comment({
      body: req.body.body,
      belongs_to: req.params.article_id,
      created_by: user._id
    });
    newComment //needs to populate created_by and belongs_to
      .save()
      .then(newComment => res.status(201).send({ newComment }))
      .catch(next);
  });
}

function voteOnArticle(req, res, next) {
  const { article_id } = req.params;
  const voteUpOrDown = req.query.vote;
  if (voteUpOrDown === 'up') amount = 1;
  if (voteUpOrDown === 'down') amount = -1;
  let update = { $inc: { votes: amount } };
  Article.findByIdAndUpdate(article_id, update, { new: true })
    .populate('created_by', 'username')
    .then(article => res.send(article))
    .catch(next);
}

module.exports = {
  getAllArticles,
  getAllCommentsForArticle,
  addCommentToArticle,
  voteOnArticle
};
