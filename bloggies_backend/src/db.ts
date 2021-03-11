/** Database setup */

import { Client } from "pg";

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///learning_circle_test";
} else {
  DB_URI = "postgresql:///learning_circle";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

export default db;