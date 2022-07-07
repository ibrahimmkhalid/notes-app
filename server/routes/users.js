const router = require('express').Router();
const {
  createUser,
  loginUser
} = require('../service/users.js');

router.route('/register').post(async (req, res) => {
  const data = req.body;
  try {
    const user = await createUser(data);
    if (!user) throw "There was an error creating your user";
    const token = await loginUser(data);
    res.json({token});
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/login').post(async (req, res) => {
  const data = req.body;

  try {
    const token = await loginUser(data);
    res.json({token});
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
