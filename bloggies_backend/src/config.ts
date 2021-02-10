const BCRYPT_WORK_FACTOR = 12;
const SECRET_KEY = "secret";
const JWT_OPTIONS = { expiresIn: 60 * 60};
const PHOTO_BUCKET = "bloggies-user-photos";

export {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  JWT_OPTIONS,
  PHOTO_BUCKET
}