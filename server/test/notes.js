process.env.NODE_ENV = 'test';

let mongoose = require("mongoose")
let User = require("../models/user.models.js");
let Note = require("../models/note.models.js");

let chai = require("chai");
let request = require("supertest");
let api = require("../api.js");

const expect = chai.expect;

//hash for 'password'
const hashedPassword = '$2b$10$HsQ0cHHufbLisYbEQxoPkOCwzTomz.E7mLYVTEM34lj3VTNexTtsu';

let mockUsersData = {
  user1: {
    username: 'user1',
    password: hashedPassword,
    admin: true,
  },
  user2: {
    username: 'user2',
    password: hashedPassword,
    admin: false
  },
}

describe('Notes', () => {
  beforeAll((done) => {
    User.create(mockUsersData, (err) => {
      done();
    });
  });
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    })
  });
})
