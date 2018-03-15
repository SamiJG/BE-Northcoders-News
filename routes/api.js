const express = require('express');
const apiRouter = express.Router();
const commentsRouter = require('./comments');
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const usersRouter = require('./users');

apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
