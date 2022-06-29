const router = require('express').Router();
const jwt = require("jsonwebtoken");
const {verifyJWT} = require("../middleware/authenticate.js");
let Note = require('../models/note.models.js');

router.route('/').get((req, res) => {
  const query = req.query.q;
  Note.find().or([
    {title: {$regex: '.*' + query + '.*', $options: 'i'}},
    {text: {$regex: '.*' + query + '.*', $options: 'i'}}
  ])
  .then(notes => res.json(notes))
  .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;

