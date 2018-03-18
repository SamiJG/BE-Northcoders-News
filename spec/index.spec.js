process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const saveTestData = require('../seed/test.seed');

describe('/', () => {
  let savedData;
  beforeEach(() => {
    return mongoose.connection
      .dropDatabase()
      .then(saveTestData)
      .then(docs => {
        savedData = docs;
        // console.log(savedData);
      })
      .catch(err => console.log(err));
  });
  after(() => {
    mongoose.disconnect();
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
    describe('/:topic/articles', () => {
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
    describe('/:article_id/comments', () => {
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
      it('POST returns an object containing the comment object just posted, and 201 status', () => {
        let article_id = savedData.articles[0]._id;
        return request
          .post(`/api/articles/${article_id}/comments`)
          .expect(201)
          .send({ body: 'Test Comment' })
          .then(res => {
            expect(res.body.newComment).to.be.an('object');
            expect(res.body.newComment.body).to.equal('Test Comment');
          });
      });
    });
    describe('/:article_id', () => {
      it('PUT vote=up, returns the article voted on with a votes count increased by one, and 200 status', () => {
        let article_id = savedData.articles[0]._id;
        return request
          .put(`/api/articles/${article_id}?vote=up`)
          .expect(200)
          .then(res => expect(res.body.votes).to.equal(1));
      });
      it('PUT vote=down, returns the article voted on with a votes count decreased by one, and 200 status', () => {
        let article_id = savedData.articles[1]._id;
        return request
          .put(`/api/articles/${article_id}?vote=down`)
          .expect(200)
          .then(res => expect(res.body.votes).to.equal(-1));
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      it('PUT vote=up, returns the comment voted on with a votes count increased by one, and 200 status', () => {
        let comment_id = savedData.comments[0]._id;
        return request
          .put(`/api/comments/${comment_id}?vote=up`)
          .expect(200)
          .then(res => expect(res.body.votes).to.equal(1));
      });
      it('PUT vote=down, returns the comment voted on with a votes count decreased by one, and 200 status', () => {
        let comment_id = savedData.comments[0]._id;
        return request
          .put(`/api/comments/${comment_id}?vote=down`)
          .expect(200)
          .then(res => expect(res.body.votes).to.equal(-1));
      });

      it('DELETE removes comment and return comment that has been delelted, and 200 status', () => {
        let comment_id = savedData.comments[0]._id;
        return request
          .delete(`/api/comments/${comment_id}`)
          .expect(200)
          .then(res => {
            expect(res.body.msg).to.equal('Your comment has been deleted');
            return request
              .get('/api/comments')
              .then(res => expect(res.body.comments.length).to.equal(1));
          });
      });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      it('GET returns an object containing an array of all users, and 200 status', () => {
        return request
          .get('/api/users')
          .expect(200)
          .then(res => {
            expect(Array.isArray(res.body.users)).to.be.true;
            expect(res.body.users.length).to.equal(1);
          });
      });
    });
    describe('/:username/articles', () => {
      it('GET returns an object containing a user object an array of all articles relating to the user, and 200 status', () => {
        return request
          .get('/api/users/northcoder/articles')
          .expect(200)
          .then(res => {
            expect(Array.isArray(res.body.articles)).to.be.true;
            expect(res.body.articles[1].title).to.equal('Football is fun');
          });
      });
    });
  });
});
