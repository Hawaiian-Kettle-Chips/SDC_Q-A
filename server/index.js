require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./router.js');
const db = require('./postgres/index.js');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`LISTENING AT PORT: ${PORT}`)
  }
});