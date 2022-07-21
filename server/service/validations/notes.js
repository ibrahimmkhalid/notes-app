const mongoose = require('mongoose');
module.exports = {
  addNewNote: function(data) {
    err = [];
    if (!data.title) {
      err.push("'title' is a required field");
    }

    if (!data.text) {
      err.push("'text' is a required field");
    }

    if (err.length !== 0) {
      throw {
        code: 400,
        validation: err
      };
    }
  },
  getNoteByID: function(data, user) {
    err = [];
    if (!data.id) {
      err.push("'id' is a required field");
    }

    if(!mongoose.isValidObjectId(data.id)) {
      err.push("invalid ObjectId")
    }

    if (err.length !== 0) {
      throw {
        code: 400,
        validation: err
      };
    }
  },
  deleteNoteByID: function(data, user) {
    err = [];
    if (!data.id) {
      err.push("'id' is a required field");
    }

    if (err.length !== 0) {
      throw {
        code: 400,
        validation: err
      };
    }
  },
  editNoteByID: function(data, user) {
    err = [];
    if (!data.id) {
      err.push("'id' is a required field");
    }

    if (err.length !== 0) {
      throw {
        code: 400,
        validation: err
      };
    }
  }
}

