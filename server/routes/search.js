const router = require('express').Router();
const jwt = require("jsonwebtoken");
const {verifyJWT} = require("../middleware/authenticate.js");
let Note = require('../models/note.models.js');

router.route('/').get((req, res) => {
  const query = req.query.q;
  Note.aggregate().
    search({
      text: {
        query: query,
        path: 'notes'
      }
    })
    .then(notes => res.json(notes))
    .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;

