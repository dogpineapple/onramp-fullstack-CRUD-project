/** Database setup */
import * as dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({ path: __dirname + '/.env'});

let { DB_USERNAME, DB_PASSWORD, DB_PORT, NODE_ENV } = process.env; 
let DB_URI;

// connect to PSQL container using docker
if (NODE_ENV === "test") {
  DB_URI = `postgresql://${DB_USERNAME}:${DB_PASSWORD}@localhost:${DB_PORT}/learning_circle_test`;
} else {
  DB_URI = `postgresql://${DB_USERNAME}:${DB_PASSWORD}@localhost:${DB_PORT}/learning_circle`;
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

export default db;