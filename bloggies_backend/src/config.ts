const BCRYPT_WORK_FACTOR = 12;
const SECRET_KEY = "secret";
const JWT_OPTIONS = { expiresIn: 60 * 60};

module.exports = {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  JWT_OPTIONS
}