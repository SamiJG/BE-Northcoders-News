const mongoose = require('mongoose');
const { Article, User } = require('../models');

function getAllUsers(req, res, next) {
  User.find()
    .then(users => res.send({ users }))
    .catch(next);
}
function getAllArticlesForUser(req, res, next) {
  const { username } = req.params;
  User.findOne({ username: username })
    .then(user => {
      return Promise.all([
        user,
        Article.find({ created_by: user._id }).populate(
          'created_by',
          'username'
        )
      ]);
    })
    .then(([user, articles]) => res.send({ user, articles }))
    .catch(next);
}
module.exports = { getAllUsers, getAllArticlesForUser };
