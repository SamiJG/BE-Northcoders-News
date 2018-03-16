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

module.exports = app;
