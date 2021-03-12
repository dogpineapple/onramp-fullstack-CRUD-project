/** Database setup */
import { Client } from "pg";

let { POSTGRES_USER, POSTGRES_PWD, POSTGRES_PORT, NODE_ENV } = process.env; 

let DB_URI;

// connect to PSQL container using docker
if (NODE_ENV === "test") {
  DB_URI = `postgresql://${POSTGRES_USER}:${POSTGRES_PWD}@localhost:${POSTGRES_PORT}/learning_circle_test`;
} else {
  DB_URI = "postgresql://${POSTGRES_USER}:${POSTGRES_PWD}@localhost:${POSTGRES_PORT}/learning_circle";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

export default db;