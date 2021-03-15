/** Database setup */
import { config } from '../db_config';
import { Pool } from "pg";

// let DB_URI;

// if (process.env.NODE_ENV === "test") {
//   DB_URI = "postgresql:///learning_circle_test";
// } else {
//   DB_URI = "postgresql:///learning_circle";
// }

let db = new Pool({
  user: config.PGUSER,
  password: config.PGPASSWORD,
  host: "localhost",
  port: 5432,
  database: "learning_circle"
  //connectionString: DB_URI
});

db.connect();

export default db;