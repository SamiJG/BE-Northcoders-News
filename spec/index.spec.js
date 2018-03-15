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
      .then(docs => (data = docs))
      .catch(err => console.log(err));
  });
  it('does something', () => {
    console.log('hi!');
  });
});
