const mongoose = require('mongoose');
const DB_URL = require('../config').DB;
const { Article, Comment, User, Topic } = require('../models');
const csv2json = require('./data/csvParser');
mongoose.Promise = Promise;
const faker = require('faker');

function seedArticles(userIds, articleData) {
  const articleIds = [];
  const articlePromises = articleData.map(article => {
    const created_by = userIds[Math.floor(Math.random() * 6)];
    const { title, body, topic: belongs_to } = article;
    const votes = 0;
    return new Article({ title, body, belongs_to, votes, created_by })
      .save()
      .then(articleDoc => {
        articleIds.push(articleDoc._id);
        return articleDoc;
      });
  });
  return Promise.all(articlePromises).then(() => articleIds);
}

function seedComments(userIds, articleIds) {
  const comments = [];
  for (let i = 1; i <= 200; i++) {
    const fakeComment = new Comment({
      body: faker.lorem.paragraph(),
      belongs_to: articleIds[Math.floor(Math.random() * 36)],
      created_at: new Date(),
      votes: 0,
      created_by: userIds[Math.floor(Math.random() * 6)]
    });
    comments.push(fakeComment);
  }
  return Comment.insertMany(comments);
}

function seedDatabase() {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log(`connected to ${DB_URL}`);
      return mongoose.connection.db.dropDatabase();
    })
    .then(() => csv2json('/topics.csv'))
    .then(topicDocs => Topic.insertMany(topicDocs))
    .then(topicDocs => {
      console.log(`added ${topicDocs.length} topics into topic collection`);
      return csv2json('/users.csv');
    })
    .then(userDocs => User.insertMany(userDocs))
    .then(userDocs => {
      const userIds = [];
      userDocs.forEach(userDoc => {
        userIds.push(userDoc._id);
      });
      console.log(`added ${userIds.length} users into user collection`);
      return userIds;
    })
    .then(userIds => {
      return Promise.all([userIds, csv2json('/articles.csv')]);
    })
    .then(([userIds, articleData]) => {
      console.log(`added ${articleData.length} users into user collection`);
      return Promise.all([userIds, seedArticles(userIds, articleData)]);
    })
    .then(([userIds, articleIds]) => {
      return seedComments(userIds, articleIds);
    })
    .then(commentData => {
      console.log(`added ${commentData.length} comments to comment collection`);
      mongoose.disconnect();
    })
    .catch(err => console.log(err));
}

seedDatabase();
