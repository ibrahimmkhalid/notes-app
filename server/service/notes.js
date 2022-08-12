let Note = require('../models/note.models.js')
const validation = require('./validations/notes.js')

function checkIfUserCanAccessNote(user, note) {
  if (
    !(
      !note.owner ||
      (note.owner && user && note.owner == user.id) ||
      (user && user.admin == true)
    )
  ) {
    throw {
      code: 401,
      authentication: ['User does not have permission to access this note'],
    }
  }
}

module.exports = {
  getAllNotes: async function (user) {
    if (user && user.admin == true) {
      return await Note.find()
    } else if (user && user.admin == false) {
      return await Note.find().or([{ owner: null }, { owner: user.id }])
    } else {
      return await Note.find().or([{ owner: null }])
    }
  },
  addNewNote: async function (data) {
    validation.addNewNote(data)
    const newNote = new Note({
      title: data.title,
      text: data.text,
      owner: data.owner,
    })
    return await newNote.save()
  },
  getNoteByID: async function (data, user) {
    validation.getNoteByID(data)
    const note = await Note.findById(data.id)
    if (!note) {
      throw {
        code: 404,
        database: ['This resource could not be found'],
      }
    }
    checkIfUserCanAccessNote(user, note)
    return note
  },
  deleteNoteByID: async function (data, user) {
    validation.deleteNoteByID(data)
    const note = await Note.findById(data.id)
    checkIfUserCanAccessNote(user, note)
    note.delete()
  },
  editNoteByID: async function (data, user) {
    validation.editNoteByID(data)
    const note = await Note.findById(data.id)
    checkIfUserCanAccessNote(user, note)
    note.title = data.title ? data.title : note.title
    note.text = data.text ? data.text : note.text
    note.save()
  },
}
