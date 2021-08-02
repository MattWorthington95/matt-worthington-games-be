const { Pool } = require('pg');
const path = require('path');
const ENV = process.env.NODE_ENV || 'development';

console.log(`Connected to ${ENV} db`);

require('dotenv').config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool();
