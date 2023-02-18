require ('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.connect((error) => {
  if (error) {
    console.error('Error connecting to database: ', error);
  } else {
    console.info(`Connected to ${process.env.PGDATABASE}`)
  }
});

module.exports = pool;