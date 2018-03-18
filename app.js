if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./config').DB;
mongoose.Promise = Promise;
const apiRouter = require('./routes/api');

mongoose
  .connect(db, { useMongoClient: true })
  .then(() => console.log('successfully connected to', db))
  .catch(err => console.log('connection failed', err));

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ Message: 'Page not found' });
});

app.use((err, req, res, next) => {
  if (err.status === 400)
    res.status(400).send({ Message: 'Bad Request', Reason: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ Message: 'Page Not Found' });
  else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ err });
});

module.exports = app;
