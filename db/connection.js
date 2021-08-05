const { Pool } = require('pg');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

console.log(`Connected to ${ENV} db`);

require('dotenv').config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE not set');
}

const config =
  ENV === 'production'
    ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
    : {};

module.exports = new Pool(config);
