const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("./routes");
const mongoose = require("mongoose");
const config = require("./config/config");
const { commonErrorHandler } = require("./helper/errorHandler.helper");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.use(helmet());

app.use(compression());

app.disable("x-powered-by");

mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/health", (_req, res) => {
  res.send({ message: "Application runing successfully!" });
});

routes.registerRoutes(app);

app.use((req, res) => {
  const message = "Invalid endpoint";
  commonErrorHandler(req, res, message, 404);
});

module.exports = app;
