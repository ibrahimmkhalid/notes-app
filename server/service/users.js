const router = require('express').Router();
const {authenticateLogin} = require("../middleware/authenticate.js");
const bcrypt = require("bcrypt");
const validation = require("./validations/users.js");
let User = require('../models/user.models.js');

module.exports ={
  createUser: async function(data) {
    validation.createUser(data);
    const takenUsername = await User.findOne({username: data.username});

    if (takenUsername) {
      throw {validation: ["Username is already taken!"]};
    } else {
      let hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = User({
        username: data.username,
        password: hashedPassword ,
      });
      return await newUser.save();
    }
  },
  loginUser: async function(data) {
    validation.loginUser(data);
    const user = await User.findOne({username: data.username}).select(['password', 'admin', 'username']);
    return await authenticateLogin(data, user);
  }
}
