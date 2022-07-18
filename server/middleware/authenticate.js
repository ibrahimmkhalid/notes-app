const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const responseHelper = require('../service/response.js');

module.exports = {
  verifyJWT: function(req, res, next) {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          responseHelper(res, async () => {
            throw {
              code: 401,
              authentication: ["Failed to authenticate"]
            };
          });
        } 
        req.user = {};
        req.user.id = decoded.id;
        req.user.username = decoded.username;
        req.user.admin = decoded.admin;
        next();
      });
    } else {
      responseHelper(res, async () => {
        throw {
          code: 401,
          authentication: ["Incorrect Token"]
        }
      });
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
      throw {
        code: 401,
        authentication: ["User does not exist!"]
      }
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      throw {
        code: 401,
        authentication: ["Password does not match!"]
      }
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
