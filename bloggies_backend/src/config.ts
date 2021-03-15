const SECRET_KEY = "secret";
const JWT_OPTIONS = { expiresIn: 60 * 60};

// The cooldown time for updating a user is 1 minute
const USER_UPDATE_COOLDOWN = 1*60*1000;

export {
  SECRET_KEY,
  JWT_OPTIONS,
  USER_UPDATE_COOLDOWN
}