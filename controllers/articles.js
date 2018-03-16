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
        }).populate('created_by', 'username')
      ]);
    })
    .then(([article, comments]) => res.send({ article, comments }))
    .catch(next);
}
module.exports = { getAllArticles, getAllCommentsForArticle };
