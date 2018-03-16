const { User, Comment, Topic, Article } = require('../models');

function saveUser() {
  const user = new User({
    username: 'northcoder',
    name: 'Awesome Northcoder',
    avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200'
  });
  return user.save();
}

function saveTopics() {
  const topics = [
    { title: 'Football', slug: 'football' },
    { title: 'Cooking', slug: 'cooking' },
    { title: 'Cats', slug: 'cats' }
  ].map(t => new Topic(t).save());
  return Promise.all(topics);
}

function saveArticles(userId) {
  const articles = [
    {
      title: 'Cats are great',
      body: 'something',
      topic: 'cats',
      created_by: userId
    },
    {
      title: 'Football is fun',
      body: 'something',
      topic: 'football',
      created_by: userId
    }
  ].map(a => new Article(a).save());
  return Promise.all(articles);
}

function saveComments(userId, articles) {
  const comments = [
    {
      body: 'this is a comment',
      belongs_to: articles[0]._id,
      created_by: userId
    },
    {
      body: 'this is another comment',
      belongs_to: articles[0]._id,
      created_by: userId
    }
  ].map(c => new Comment(c).save());
  return Promise.all(comments);
}

function saveTestData() {
  const savedData = {};
  return saveUser()
    .then(user => {
      savedData.user = user;
      return saveTopics();
    })
    .then(topics => {
      savedData.topics = topics;
      return saveArticles(savedData.user._id);
    })
    .then(articles => {
      savedData.articles = articles;
      return saveComments(savedData.user._id, articles);
    })
    .then(comments => {
      savedData.comments = comments;
      return savedData;
    });
}

module.exports = saveTestData;
