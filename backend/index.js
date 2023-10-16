// const express = require("express");
// require("dotenv").config({path:'./.env'});
// const mongoose = require("mongoose");
// const cookieParser = require('cookie-parser');
// const todoListRoute = require('./routes/todoList.route');
// const authRouter = require('./routes/auth.route');
// const cors = require('cors');

// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());

// mongoose.connect("mongodb://localhost:27017/todolist", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.use('/',todoListRoute);
// app.use('/',authRouter);


// const Port = 1010;

// app.listen(Port, () => {
//   console.log(`Server is starting at ${Port}`);
// });


const app = require("./app");
const config = require('./config/config')
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