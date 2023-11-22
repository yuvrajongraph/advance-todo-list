const app = require("./app");
const config = require("./config/config");
const notifier = require("node-notifier");
const schedule = require("node-schedule");
const Todo = require("./models/todoList.model");
const Appointment = require("./models/appointment.model");
const http = require("http");
const {Server} = require("socket.io");

const startServer = async function () {
  try {
    console.log("... Microservice db ✔");
    const server = http.createServer(app);
    const io = new Server(server,{
      cors: {
        origin: config.FRONTEND_URL,
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log("A client connected");
    });
    server.listen(config.SERVER_PORT);
    console.log(`--- Server started on ${config.SERVER_PORT} ---\n\n`);

   
    const job = schedule.scheduleJob("*/1 * * * * *", async function () {
      const todos = await Todo.find({});
      const appointments = await Appointment.find({});
      const currentDateTime = new Date();
      currentDateTime.setMilliseconds(0);

      todos.map((val) => {
       
        val.dateTime.setMinutes(val.dateTime.getMinutes() - 1);
        if (
          new Date(val.dateTime).toISOString() === currentDateTime.toISOString()
        ) {
          notifier.notify(`Alarm notification for event ${val.title}`);
          io.emit("reloadPage");
        }
      });
      appointments.map((val) => {
        val.startTime.setMinutes(val.startTime.getMinutes() - 1);
        if (
          new Date(val.startTime).toISOString() ===
          currentDateTime.toISOString()
        ) {
          notifier.notify(`Alarm notification for event ${val.title}`);
          io.emit("reloadPage");
        }
      });
    });

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
