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

// Enable to access cookie using the request parameter
app.use(cookieParser());

// Enable cors support to accept cross origin requests
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

// Enable helmet js middlewares to configure secure headers
app.use(helmet());

// Enable gzip compression module for REST API
app.use(compression());

// Disble x-powered-by header to hide server side technology
app.disable("x-powered-by");

//  Server connect with MongoDB using mongoose
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/health", (_req, res) => {
  res.send({ message: "Application runing successfully!" });
});

// REST API entry point
routes.registerRoutes(app);

// 404 Error Handling
app.use((req, res) => {
  const message = "Invalid endpoint";
  commonErrorHandler(req, res, message, 404);
});

module.exports = app;
