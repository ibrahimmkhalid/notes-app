const router = require('express').Router();
const responseHelper = require('../service/response.js');
const {
  createUser,
  loginUser
} = require('../service/users.js');

router.route('/register').post(async (req, res) => {
  const data = req.body;
  await responseHelper(res, async () => {
    const user = await createUser(data);
    if (user) {
      throw {general: ["There was an error creating your user"]};
    }
    const token = await loginUser(data);
    return {token};
  });
});

router.route('/login').post(async (req, res) => {
  const data = req.body;
  await responseHelper(res, async () => {
    const token = await loginUser(data);
    return {token};
  });
});

module.exports = router;
