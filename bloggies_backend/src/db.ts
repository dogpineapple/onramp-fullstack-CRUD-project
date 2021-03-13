/** Database setup */

import { Client } from "pg";
require('dotenv').config({ path: require('find-config')('.env') })

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/learning_circle_test`;
} else {
  DB_URI = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/learning_circle`;
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

export default db;