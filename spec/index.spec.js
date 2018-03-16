process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const saveTestData = require('../seed/test.seed');

describe('/', () => {
  after(() => {
    mongoose.disconnect();
  });
  beforeEach(() => {
    let data;
    return mongoose.connection
      .dropDatabase()
      .then(saveTestData)
      .then(docs => {
        data = docs;
        // console.log(data);
      })
      .catch(err => console.log(err));
  });
  describe('/topics', () => {
    it('GET returns an object containing an array of all topics, and 200 status', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(Array.isArray(res.body.topics)).to.be.true;
          expect(res.body.topics.length).to.equal(3);
        });
    });
    describe('/topics/:topic/articles', () => {
      it('GET returns an object containing an array of all articles relating to a topic, and 200 status', () => {
        return request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(res => {
            expect(Array.isArray(res.body.articles)).to.be.true;
            expect(res.body.articles[0].title).to.equal('Cats are great');
          });
      });
    });
  });
  describe('/articles', () => {
    it('GET returns an object containing an array of all articles, and 200 status', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(Array.isArray(res.body.articles)).to.be.true;
          expect(res.body.articles.length).to.equal(2);
        });
    });
    describe('/articles/:article_id/comments', () => {
      it('GET returns an object containing an article object an array of all comments relating to the article, and 200 status', () => {
        let article_id;
        return request.get('/api/articles').then(res => {
          article_id = res.body.articles[0]._id;
          return request
            .get(`/api/articles/${article_id}/comments`)
            .expect(200)
            .then(res => {
              expect(res.body.article).to.be.an('object');
              expect(Array.isArray(res.body.comments)).to.be.true;
            });
        });
      });
    });
  });
});
