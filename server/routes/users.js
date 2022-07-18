const router = require('express').Router();
const responseHelper = require('../service/response.js');
const service = require('../service/users.js');

router.route('/register').post(async (req, res) => {
  const data = req.body;
  await responseHelper(res, async () => {
    const user = await service.createUser(data);
    if (!user) {
      throw {
        general: ["There was an error creating your user"],
        code: 500
      };
    }
    const token = await service.loginUser(data);
    return {token};
  });
});

router.route('/login').post(async (req, res) => {
  const data = req.body;
  await responseHelper(res, async () => {
    const token = await service.loginUser(data);
    return {token};
  });
});

module.exports = router;
