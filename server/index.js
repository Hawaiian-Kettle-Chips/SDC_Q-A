require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
// require router
// require db

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const PORT = process.env.PORT;

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`LISTENING AT PORT: ${process.env.PORT}`)
  }
});