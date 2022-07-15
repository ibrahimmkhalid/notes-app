module.exports = {
  createUser: function(data) {
    err = [];
    if (!data.username) {
      err.push("'username' is a required field");
    }

    if (!data.password) {
      err.push("'password' is a required field");
    }
    if (err.length !== 0) {
      throw {validation: err};
    }
  },
  loginUser: function(data) {
    err = [];
    if (!data.username) {
      err.push("'username' is a required field");
    }

    if (!data.password) {
      err.push("'password' is a required field");
    }
    if (err.length !== 0) {
      throw {validation: err};
    }
  }
}
