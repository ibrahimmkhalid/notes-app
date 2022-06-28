const router = require('express').Router();
const {verifyJWT, getAuthenticatedUser} = require("../middleware/authenticate.js");
let Note = require('../models/note.models.js');

router.route('/').get((req, res) => {
  Note.find()
    .then(notes => res.json(notes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const text = req.body.text;

  const newNote = new Note({
    title: title,
    text: text,
    owner: null,
  });

  newNote.save()
  .then(() => res.json('Note added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add/private').post(verifyJWT, (req, res) => {
  const title = req.body.title;
  const text = req.body.text;
  const owner = req.user.id;

  const newNote = new Note({
    title: title,
    text: text,
    owner: owner,
  });

  newNote.save()
  .then(() => res.json('Private note added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').get((req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      let user = getAuthenticatedUser(req);
      if (!note.owner || (note.owner && user && note.owner == user.id)) {
        return res.json(note);
      } else {
        return res.json({
          status: "fail",
          message: "You are not authorized to view this note"
        })
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      let user = getAuthenticatedUser(req);
      if (!note.owner || (note.owner && user && note.owner == user.id)) {
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
      note.title = req.body.title;
      note.text = req.body.text;

      note.save()
        .then(() => res.json('Note updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
