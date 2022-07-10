process.env.NODE = 'test';

let mongoose = require("mongoose")
let User = require("../models/user.models.js");

let chai = require("chai");
let api = require("../api.js");

describe('Users', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });
});
