const app = require("./app");
const config = require("./config/config");
const startServer = async function () {
  try {
    console.log("... Microservice db ✔");
    app.listen(config.SERVER_PORT);
    console.log(`--- Server started on ${config.SERVER_PORT} ---\n\n`);

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error) => {
      console.log(`Server Error: ${error.message}`);
      exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);
  } catch (err) {
    console.log("server setup failed", err);
    console.log("Error: ", err.message);
  }
};

startServer();
