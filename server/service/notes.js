const {verifyJWT, getAuthenticatedUser} = require("../middleware/authenticate.js");
let Note = require('../models/note.models.js');

function canUserAccessNote(user, note) {
  return !note.owner
    || (note.owner && user && note.owner == user.id)
    || (user && user.admin == true);
}

module.exports = {
  getAllNotes: async function(user) {
    if (user && user.admin == true) {
      return await Note.find();
    } else if (user && user.admin == false) {
      return await Note.find().or([
        {owner: null},
        {owner: user.id}
      ]);
    } else {
      return await Note.find().or([
        {owner: null}
      ]);
    }
  },
  addNewNote: async function(data) {
    const newNote = new Note({
      title: data.title,
      text: data.text,
      owner: data.owner,
    });
    return await newNote.save();
  },
  getNoteByID: function(data, user) {
    if (user && user.admin == true) {
      return Note.findById(data.id);
    } else if (user && user.admin == false) {
      return Note.findById(data.id).or([
        {owner: null},
        {owner: user.id}
      ]);
    } else {
      return Note.findById(data.id).or([
        {owner: null}
      ]);
    }
  }
}

