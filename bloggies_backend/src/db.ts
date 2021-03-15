/** Database setup */

import { Pool } from "pg";

// let DB_URI;

// if (process.env.NODE_ENV === "test") {
//   DB_URI = "postgresql:///learning_circle_test";
// } else {
//   DB_URI = "postgresql:///learning_circle";
// }

let db = new Pool({
  user: "postgres",
  password: "mypassword123",
  host: "localhost",
  port: 5432,
  database: "learning_circle"
  //connectionString: DB_URI
});



db.connect();

// db.query("SELECT * FROM posts", (err, res) => {
//   console.log(err ? err.stack : res.rows); 
//   db.end();
// });

export default db;