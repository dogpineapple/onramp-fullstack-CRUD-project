const BCRYPT_WORK_FACTOR = 12;
const SECRET_KEY = "secret";
const JWT_OPTIONS = { expiresIn: 60 * 60};
const PHOTO_BUCKET = "bloggies-user-photos";

// The cooldown time for updating a user is 1 minute
const USER_UPDATE_COOLDOWN = 1*60*1000;

export {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  JWT_OPTIONS,
  PHOTO_BUCKET,
  USER_UPDATE_COOLDOWN
}