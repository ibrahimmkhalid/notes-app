const router = require('express').Router();
const responseHelper = require('../service/response.js');
const {verifyJWT, getAuthenticatedUser} = require("../middleware/authenticate.js");
const {
  getAllNotes, 
  addNewNote, 
  getNoteByID,
  deleteNoteByID,
  editNoteByID
} = require("../service/notes.js");

router.route('/all').get((req, res) => {
  responseHelper(res, async () => {
    const user = getAuthenticatedUser(req);
    const notes = await getAllNotes(user);
    return {notes};
  });
});

router.route('/add/public').post((req, res) => {
  const data = req.body;
  data.owner = null;
  responseHelper(res, async () => {
    let note = await addNewNote(data);
    return {note};
  });
});

router.route('/add/private').post(verifyJWT, (req, res) => {
  const data = req.body;
  data.owner = req.user.id;
  responseHelper(res, async () => {
    let note = await addNewNote(data);
    return {note};
  });
});

router.route('/:id').get((req, res) => {
  const data = req.params;
  responseHelper(res, async () => {
    const user = getAuthenticatedUser(req);
    const note = await getNoteByID(data, user);
    return {note};
  });
});

router.route('/:id').delete(async (req, res) => {
  const data = req.params;
  responseHelper(res, async () => {
    const user = getAuthenticatedUser(req);
    await deleteNoteByID(data, user);
  });
});

router.route('/update/:id').post(async (req, res) => {
  const data = {
    ...req.params,
    ...req.body
  };
  responseHelper(res, async () => {
    const user = getAuthenticatedUser(req);
    await editNoteByID(data, user);
  });
});

module.exports = router;
