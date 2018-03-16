const express = require('express');
const usersRouter = express.Router();
const { getAllUsers, getAllArticlesForUser } = require('../controllers/users');

usersRouter.route('/').get(getAllUsers);

usersRouter.route('/:username/articles').get(getAllArticlesForUser);

module.exports = usersRouter;
