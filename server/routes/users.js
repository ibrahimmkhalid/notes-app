const router = require('express').Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let User = require('../models/user.models.js');

router.route('/register').post(async (req, res) => {
  const data = req.body;

  const takenUsername = await User.findOne({username: data.username});

  if (takenUsername) {
    res.json({
      status: "fail",
      message: "Username is already taken!"
    });
  } else {
    data.password = await bcrypt.hash(req.body.password, 10);
    const newUser = User({
      username: data.username,
      password: data.password,
    });
    newUser.save();
    res.json({
      status: "success",
      message: "Successfully signed up"
    });
  }
});

router.route('/login').post((req, res) => {
  const data = req.body;

  User.findOne({username: data.username})
  .then(user => {
    if(!user) {
      return res.json({
        status: "fail",
        message: "User does not exist!"
      });
    }

    bcrypt.compare(data.password, user.password)
    .then(match => {
      if (match) {
        const payload = {
          id: user.id,
          username: user.username,
        };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {expiresIn: 999999},
          (err, token) => {
            if (err) return res.json({message: err});
            return res.json({
              status: "success",
              message: "Logged in!",
              token: "Bearer " + token,
            })
          }
        )
      } else {
        return res.json({
          status: "fail",
          message: "User does not exist!"
        });
      }
    })
  })
});

module.exports = router;
