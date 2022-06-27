const jwt = require("jsonwebtoken");

module.exports = {
  verifyJWT: function(req, res, next) {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.json({
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
      res.json({
        status: "fail",
        message: "Incorrect Token!",
        isLoggedIn: false,
      })
    }
  }
}
