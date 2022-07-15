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
  getNoteByID: async function(data, user) {
    const note = await Note.findById(data.id);
    if (!canUserAccessNote(user, note)) {
      throw "Access Error";
    }
    return note;
  },
  deleteNoteByID: async function(data, user) {
    const note = await Note.findById(data.id);
    if (!canUserAccessNote(user, note)) {
      throw "Access Error";
    }
    note.delete();
  },
  editNoteByID: async function(data, user) {
    const note = await Note.findById(data.id);
    if (!canUserAccessNote(user, note)) {
      throw "Access Error";
    }
    note.title = data.title ? data.title : note.title
    note.text = data.text ? data.text : note.text
    note.save();

  }
}

