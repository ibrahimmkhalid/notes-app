process.env.NODE_ENV = 'test';

let mongoose = require("mongoose")
let User = require("../models/user.models.js");

let chai = require("chai");
let request = require("supertest");
let api = require("../api.js");

const expect = chai.expect;

let mockUsersData = {
  user1: {
    username: 'user1',
    password: 'user1',
    admin: true,
  },
  user2: {
    username: 'user2',
    password: 'user2',
    admin: false,
  },
}

describe('Users', () => {
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  describe('Register a user', () => {
    it('should register a single user', async () => {
      await request(api)
      .post('/register')
      .send(mockUsersData.user1)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('token');
      });
    });
  });

  after((done) => {
    mongoose.disconnect(done);
  })
});
