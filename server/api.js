require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const db = require("./config/db.config.js");
const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = `mongodb+srv://${db.MONGODB_USERNAME}:${db.MONGODB_PASSWORD}@${db.MONGODB_CLUSTER}/?retryWrites=true&w=majority`;
mongoose.connect(MONGODB_URI);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const notesRouter = require('./routes/notes');
const usersRouter = require('./routes/users');

app.use('/notes', notesRouter);
app.use('/', usersRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

