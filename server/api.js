require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const db = require("./config/db.config.js");

const api = express();

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const notesRouter = require('./routes/notes');
const usersRouter = require('./routes/users');

api.use(cors());
api.use(express.json());

api.use('/notes', notesRouter);
api.use('/', usersRouter);

let MONGODB_URI;
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = 'mongodb://127.0.0.1:27017/notes';
} else {
  MONGODB_URI = `mongodb+srv://${db.MONGODB_USERNAME}:${db.MONGODB_PASSWORD}@${db.MONGODB_CLUSTER}/?retryWrites=true&w=majority`;
}
mongoose.connect(MONGODB_URI);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  api.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
});

module.exports = api;
