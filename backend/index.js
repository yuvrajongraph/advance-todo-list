const app = require("./app");
const config = require("./config/config");
const startServer = async function () {
  try {
    console.log("... Microservice db ✔");
    app.listen(config.SERVER_PORT);
    console.log(`--- Server started on ${config.SERVER_PORT} ---\n\n`);
  } catch (err) {
    console.log("server setup failed", err);
    console.log("Error: ", err.message);
  }
};

startServer();
