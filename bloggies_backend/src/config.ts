import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });

const {
  NODE_ENV,
  STRIPE_API_KEY,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  SECRET_KEY,
  SENDGRID_API_KEY
} = process.env;

const BCRYPT_WORK_FACTOR = Number(process.env.BCRYPT_WORK_FACTOR);
const FRONTEND_URL = NODE_ENV === "development" ? "http://localhost:3000/" : "http://localhost:3000/"; //change when hosted in production

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
  SENDGRID_API_KEY,
  FRONTEND_URL
};
