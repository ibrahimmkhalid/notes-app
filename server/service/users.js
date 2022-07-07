const router = require('express').Router();
const {authenticateLogin} = require("../middleware/authenticate.js");
const bcrypt = require("bcrypt");
let User = require('../models/user.models.js');

module.exports ={
  createUser: async function(data) {
    const takenUsername = await User.findOne({username: data.username});

    if (takenUsername) {
      throw "Username is already taken!";
    } else {
      let hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = User({
        username: data.username,
        password: hashedPassword ,
      });
      await newUser.save();
    }
  },
  loginUser: async function(data) {
    const user = await User.findOne({username: data.username}).select('password');
    return await authenticateLogin(data, user);
  }
}
