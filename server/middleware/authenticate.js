const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  verifyJWT: function(req, res, next) {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(400).json({
          status: "fail",
          message: "Failed to authenticate",
          isLoggedIn: false
        });
        req.user = {};
        req.user.id = decoded.id;
        req.user.username = decoded.username;
        req.user.admin = decoded.admin;
        next();
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Incorrect Token!",
        isLoggedIn: false,
      })
    }
  },
  getAuthenticatedUser: function(req) {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return null;
        return decoded;
      });
    } else {
      return null;
    }
  },
  authenticateLogin: async function(data, user) {
    if (!user) {
      throw {authentication: ["User does not exist!"]}
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      throw {authentication: ["Password does not match!"]}
    }

    const payload = {
      id: user.id,
      username: user.username,
      admin: user.admin
    };

    return await jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {expiresIn: 864000}
    )
  }
}
