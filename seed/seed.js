const mongoose = require('mongoose');
const { Articles, Comments, Users, Topics } = require('../models');
const csv2json = require('./data/csvParser');
mongoose.Promise = Promise;

// This should seed your development database using the CSV file data
// Feel free to use the async library, or native Promises, to handle the asynchronicity of the seeding operations.

function seedDatabase() {
  mongoose
    .connect('mongodb://localhost:27017/northcoders-news-api')
    .then(() => csv2json('/topics.csv'))
    .then(topicDocs => Topics.insertMany(topicDocs))
    .then(console.log);
}

seedDatabase();
