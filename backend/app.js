const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("./routes");
const mongoose = require("mongoose");
const config = require("./config/config");
const { commonErrorHandler } = require("./helper/errorHandler.helper");
const cookieParser = require("cookie-parser");
const passport = require('passport');
const session = require('express-session')
const isAuthenticate = require('./middlewares/auth.middleware')
// const authController = require('./controllers/auth.controller')


const app = express();
app.use(express.json());

// read ejs files in views folder
app.set('view engine','ejs');

// app.use(authController.middleWare);

app.use(session({
  secret:'mysecret',
  resave:false,
  cookie:{secure:false}
}))

app.use(passport.initialize());

app.use(passport.session());

// Enable to access cookie using the request parameter
app.use(cookieParser());

// Enable cors support to accept cross origin requests
app.use(
  cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Enable helmet js middlewares to configure secure headers
app.use(helmet());

// Enable gzip compression module for REST API
app.use(compression());

// Disble x-powered-by header to hide server side technology
app.disable("x-powered-by");

app.use(express.urlencoded({extended:true}))

// app.use(express.static('./uploads'));

//  Server connect with MongoDB using mongoose
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/health", async (req, res) => {
  
  return res.send({ message: "Application runing successfully!" });
});

app.get('/',(req,res)=>{
  return res.render("googleAuth");
})

// app.get(`/verify-signup/${authController.randomToken}`,(req,res)=>{
//   const verifySignupURL = `http://localhost:1010/auth/signup/token=${req.locals.Token}`;
//   const ejsData={
//     title: 'Verify Signup by link',
//     link: verifySignupURL
//   }
//    return res.render('verifySignup',ejsData)
// })

// REST API entry point

routes.registerRoutes(app);


// 404 Error Handling
app.use((req, res) => {
  const message = "Invalid endpoint";
  commonErrorHandler(req, res, message, 404);
});

module.exports = app;
