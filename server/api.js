require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

