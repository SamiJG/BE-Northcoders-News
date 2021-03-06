const mongoose = require('mongoose');
const { Article, Comment, User } = require('../models');

function getAllArticles(req, res, next) {
  Article.find()
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
      .catch(err => {
        if (err._message === 'comments validation failed')
          return next({
            status: 400,
            msg: 'Unable to add comment: Article does not exist',
            err
          });
        next(err);
      });
  });
}

function voteOnArticle(req, res, next) {
  const { article_id } = req.params;
  const vote = req.query.vote;
  if (vote) {
    if (vote === 'up') value = 1;
    else if (vote === 'down') value = -1;
    else value = 0;
    Article.findByIdAndUpdate(
      article_id,
      { $inc: { votes: value } },
      { new: true }
    )
      .populate('created_by', 'username')
      .then(article => res.send(article))
      .catch(err => {
        if (err.name === 'CastError')
          return next({
            status: 400,
            msg: 'Unable to vote: Article does not exist',
            err
          });
        next(err);
      });
  } else return next({ status: 404 });
}

module.exports = {
  getAllArticles,
  getAllCommentsForArticle,
  addCommentToArticle,
  voteOnArticle
};
