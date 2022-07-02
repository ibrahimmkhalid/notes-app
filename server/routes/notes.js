const router = require('express').Router();
const {verifyJWT, getAuthenticatedUser} = require("../middleware/authenticate.js");
let Note = require('../models/note.models.js');
const {
  getAllNotes, 
  addNewNote, 
  getNoteByID,
  deleteNoteByID,
  editNoteByID
} = require("../service/notes.js");

function canUserAccessNote(user, note) {
  return !note.owner
    || (note.owner && user && note.owner == user.id)
    || (user && user.admin == true);
}

router.route('/all').get(async (req, res) => {
  const user = getAuthenticatedUser(req);
  let notes;
  try {
    notes = await getAllNotes(user);
    res.json(notes);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add/public').post((req, res) => {
  const data = req.body;
  data.owner = null;
  
  try {
    addNewNote(data);
    res.json('Note Added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add/private').post(verifyJWT, (req, res) => {
  const data = req.body;
  data.owner = req.user.id;
  
  try {
    addNewNote(data);
    res.json('Private note Added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get(async (req, res) => {
  const data = req.params;
  const user = getAuthenticatedUser(req);
  let note;
  try {
    note = await getNoteByID(data, user);
    res.json(note);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').delete(async (req, res) => {
  const data = req.params;
  const user = getAuthenticatedUser(req);
  try {
    await deleteNoteByID(data, user);
    res.json("Note Deleted!")
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/update/:id').post(async (req, res) => {
  const data = {
    ...req.params,
    ...req.body
  };
  const user = getAuthenticatedUser(req);
  try {
    await editNoteByID(data, user);
    res.json("Note Edited!");
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
