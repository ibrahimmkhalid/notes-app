const router = require('express').Router();
const {verifyJWT, getAuthenticatedUser} = require("../middleware/authenticate.js");
let Note = require('../models/note.models.js');
const {getAllNotes, addNewNote, getNoteByID} = require("../service/notes.js");

function canUserAccessNote(user, note) {
  return !note.owner
    || (note.owner && user && note.owner == user.id)
    || (user && user.admin == true);
}

router.route('/all').get(async (req, res) => {
  user = getAuthenticatedUser(req);
  let notes;
  try {
    notes = await getAllNotes(user);
    res.json(notes);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
  // getAllNotes(user)
  // .then(notes => res.json(notes))
  // .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add/public').post((req, res) => {
  const data = req.body;
  data.owner = null;

  addNewNote(data)
  .then(() => res.json('Note added!'))
  .catch(err => res.status(400).json('Error: ' + err));
 });

router.route('/add/private').post(verifyJWT, (req, res) => {
  const data = req.body;
  data.owner = req.user.id;

  addNewNote(data)
  .then(() => res.json('Private note added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').get((req, res) => {
  const data = req.params;
  let user = getAuthenticatedUser(req);
  getNoteByID(data, user)
  .then(note => res.json(note))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      let user = getAuthenticatedUser(req);
      if (canUserAccessNote(user, note)) {
        note.delete();
        return res.json("Note Deleted");
      } else {
        return res.json({
          status: "fail",
          message: "You are not authorized to delete this note"
        })
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      let user = getAuthenticatedUser(req);
      if (canUserAccessNote(user, note)) {
        note.title = req.body.title;
        note.text = req.body.text;

        note.save()
          .then(() => res.json('Note updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      } else {
        return res.json({
          status: "fail",
          message: "You are not authorized to edit this note"
        })
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
