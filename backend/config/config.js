const dotenv = require("dotenv");

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
};

module.exports = config;
