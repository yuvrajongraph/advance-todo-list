const app = require("./app");
const config = require("./config/config");
const notifier = require("node-notifier");
const schedule = require("node-schedule");
const Todo = require("./models/todoList.model");
const Appointment = require('./models/appointment.model');
const { asyncHandler } = require("./middlewares/asyncHandler.middleware");
const { verifyToken } = require("./middlewares/auth.middleware");

const startServer = async function () {
  try {
    console.log("... Microservice db ✔");
    app.listen(config.SERVER_PORT);
    console.log(`--- Server started on ${config.SERVER_PORT} ---\n\n`);
    const job = schedule.scheduleJob(
      "*/1 * * * * *",
      async function (req, res) {
        const todos = await Todo.find({});
        const appointments = await Appointment.find({});
        const currentDateTime = new Date();
        currentDateTime.setMilliseconds(0);

        todos.map((val) => {
          val.dateTime.setMinutes(val.dateTime.getMinutes() - 1);
          if (
            new Date(val.dateTime).toISOString() ===
            currentDateTime.toISOString()
          ) {
            notifier.notify(`Alarm notification for event ${val.title}`);
          }
        });
        appointments.map((val) => {
          val.startTime.setMinutes(val.startTime.getMinutes() - 1);
          if (
            new Date(val.startTime).toISOString() ===
            currentDateTime.toISOString()
          ) {
            notifier.notify(`Alarm notification for event ${val.title}`);
          }
        });
      }
    );

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
