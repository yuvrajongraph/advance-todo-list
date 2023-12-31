/* eslint-disable no-undef */
const dotenv = require("dotenv");

// Configure the env file according to node environment
if (process.env.NODE_ENV.trim() === "development".trim()) {
  dotenv.config({ path: __dirname + "/../.env.development" });
} else if (process.env.NODE_ENV.trim() === "test") {
  dotenv.config({ path: __dirname + "/../.env.test" });
} else if (process.env.NODE_ENV.trim() === "production".trim()) {
  dotenv.config({ path: __dirname + "/../.env.production" });
} else {
  console.warn("No matching .env file found. Using default .env");
  dotenv.config(); // Load the default .env file if NODE_ENV doesn't match any specific file
}

const config = {
  SERVER_PORT: process.env.SERVER_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_URL: process.env.DB_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CONTACT_CLIENT_ID: process.env.GOOGLE_CONTACT_CLIENT_ID,
  GOOGLE_CONTACT_CLIENT_SECRET: process.env.GOOGLE_CONTACT_CLIENT_SECRET,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  GOOGLE_REDIRECT_URI : process.env.GOOGLE_REDIRECT_URI,
  CALENDAR_API_KEY: process.env.CALENDAR_API_KEY
};

module.exports = config;
