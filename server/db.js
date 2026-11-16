require('dotenv').config();
const { Pool, types } = require('pg');

// By default pg gives NUMERIC columns back as strings when they need to be numbers
types.setTypeParser(1700, (value) => parseFloat(value));

// By default pg turns DATE columns into JS Date objects, which can shift the day because timezones. 
types.setTypeParser(1082, (value) => value);

// Read settings from the .env file
module.exports = new Pool();
