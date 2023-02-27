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
  },
  user2: {
    username: 'user2',
    password: 'user2',
  },
}

describe('Users', () => {
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });
  describe('Register a user', () => {
    it('should register a single user', (done) => {
      request(api)
        .post('/register')
        .send(mockUsersData.user1)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('username');
          expect(res.body.data).to.have.property('admin');
          done();
        });
    });

    it('should not register user with missing data', (done) => {
      request(api)
        .post('/register')
        .send({})
        .end((err, res) => {
          expect(res.status).to.eq(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.have.property('validation');
          expect(res.body.error.validation).to.include("'username' is a required field");
          expect(res.body.error.validation).to.include("'password' is a required field");
          request(api)
            .post('/register')
            .send({ username: 'test' })
            .end((err, res) => {
              expect(res.status).to.eq(400);
              expect(res.body).to.have.property('error');
              expect(res.body.error).to.have.property('validation');
              expect(res.body.error.validation).to.include("'password' is a required field");
              request(api)
                .post('/register')
                .send({ password: 'test' })
                .end((err, res) => {
                  expect(res.status).to.eq(400);
                  expect(res.body).to.have.property('error');
                  expect(res.body.error).to.have.property('validation');
                  expect(res.body.error.validation).to.include("'username' is a required field");
                  request(api)
                    .post('/register')
                    .send({ password: 'test', username: 'test' })
                    .end((err, res) => {
                      expect(res.status).to.eq(200);
                      done();
                    });
                });
            });
        });
    });

    it('should register multiple users who are different', (done) => {
      request(api)
        .post('/register')
        .send(mockUsersData.user1)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('username');
          expect(res.body.data).to.have.property('admin');

          request(api)
            .post('/register')
            .send(mockUsersData.user2)
            .end((err, res) => {
              expect(res.status).to.eq(200);
              expect(res.body.data).to.have.property('token');
              expect(res.body.data).to.have.property('username');
              expect(res.body.data).to.have.property('admin');
              done();
            });
        });
    });

    it('should not register multiple users who are the same', (done) => {
      request(api)
        .post('/register')
        .send(mockUsersData.user1)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('username');
          expect(res.body.data).to.have.property('admin');

          request(api)
            .post('/register')
            .send(mockUsersData.user1)
            .end((err, res) => {
              expect(res.status).to.eq(400);
              expect(res.body).to.have.property('error');
              expect(res.body.error).to.have.property('validation');
              expect(res.body.error.validation).to.include('Username is already taken!');
              done();
            });
        });
    });
  });

  describe('Login a user', () => {

    it('should login a user', (done) => {
      request(api)
        .post('/register')
        .send(mockUsersData.user1)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('username');
          expect(res.body.data).to.have.property('admin');

          request(api)
            .post('/login')
            .send(mockUsersData.user1)
            .end((err, res) => {
              expect(res.status).to.eq(200);
              expect(res.body.data).to.have.property('token');
              expect(res.body.data).to.have.property('username');
              expect(res.body.data).to.have.property('admin');
              done();
            });
        });
    });

    it('should not login a user with wrong password', (done) => {
      request(api)
        .post('/register')
        .send(mockUsersData.user1)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('username');
          expect(res.body.data).to.have.property('admin');

          //different password
          let _data = {
            username: mockUsersData.user1.username,
            password: 'wrong password'
          };

          request(api)
            .post('/login')
            .send(_data)
            .end((err, res) => {
              expect(res.status).to.eq(401);
              expect(res.body).to.have.property('error')
              expect(res.body.error).to.have.property('authentication');
              expect(res.body.error.authentication).to.include('Password does not match!');
              done();
            });
        });
    });

    it('should not login a user that does not exist', (done) => {
      request(api)
        .post('/login')
        .send(mockUsersData.user1)
        .end((err, res) => {
          expect(res.status).to.eq(401);
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.property('authentication');
          expect(res.body.error.authentication).to.include('User does not exist!');
          done();
        });
    });
  });

  after((done) => {
    mongoose.disconnect(done);
  })
});
