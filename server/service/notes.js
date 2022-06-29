const {verifyJWT, getAuthenticatedUser} = require("../middleware/authenticate.js");
let Note = require('../models/note.models.js');

function canUserAccessNote(user, note) {
  return !note.owner
    || (note.owner && user && note.owner == user.id)
    || (user && user.admin == true);
}

module.exports = {
  getAllNotes: function(user) {
    if (user && user.admin == true) {
      return Note.find();
    } else if (user && user.admin == false) {
      return Note.find().or([
        {owner: null},
        {owner: user.id}
      ]);
    } else {
      return Note.find().or([
        {owner: null}
      ]);
    }
  },
  addNewNote: function(data) {
    const newNote = new Note({
      title: data.title,
      text: data.text,
      owner: data.owner,
    });
    return newNote.save()
  }
}

