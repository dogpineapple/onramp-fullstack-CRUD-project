import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });

const {
  NODE_ENV,
  STRIPE_API_KEY,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
} = process.env;

// const SECRET_KEY = "secret";
const JWT_OPTIONS = { expiresIn: 60 * 60 };

// The cooldown time for updating a user is 1 minute
const USER_UPDATE_COOLDOWN = 1 * 60 * 1000;

export {
  NODE_ENV,
  STRIPE_API_KEY,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  JWT_OPTIONS,
  USER_UPDATE_COOLDOWN,
};
