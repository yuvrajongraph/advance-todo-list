/* eslint-disable no-undef */
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { commonErrorHandler } = require("../helper/errorHandler.helper");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {
  generateHashPassword,
  compareHashPassword,
} = require("../utils/bcryptFunctions.utils");
const { sendMail } = require("../utils/sendMail.utils");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const {google} = require("googleapis");
const dayjs = require("dayjs");
// const UniqueStringGenerator = require("unique-string-generator");
const tokenSet = new Set();
// const randomToken = UniqueStringGenerator.UniqueString();
// let Token ;


const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CONTACT_CLIENT_ID,
  config.GOOGLE_CONTACT_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);

// @desc    Signup user
// @route   POST /api/auth/signup
// @access  Public

const userSignUp = asyncHandler(async (req, res) => {
  const body = req.body;

  const hash = generateHashPassword(body.password);

  body.password = hash;

  // if user already exist with similar email id
  const existingUser = await User.findOne({
    $and: [{ email: body.email }, { isRegister: true }],
  });
  if (existingUser) {
    return commonErrorHandler(
      req,
      res,
      null,
      409,
      "User already exists with this email id"
    );
  } else {
    // create user schema and save in database

    const user = new User(body);
    const data = await user.save();

    // create the token for sign up verification
    const token = jwt.sign(
      { email: data.email, id: data._id },
      config.JWT_SECRET
    );
    // Token = token;

    // read the content of html from ejs file
    const templatePath = path.join(
      __dirname + "/../",
      "views",
      "signupEmail.ejs"
    );
    const templateContent = fs.readFileSync(templatePath, "utf8");
    const EmailURL = `${config.FRONTEND_URL}/auth/signup?token=${token}`;

    // send an object of data to mail
    const ejsData = {
      title: "Email for Signup verification",
      link: EmailURL,
    };

    const renderedTemplate = ejs.render(templateContent, ejsData);
    sendMail(renderedTemplate, "Sign up", data.email);

    // final response
    return commonErrorHandler(
      req,
      res,
      { quote: "Link sent to email for verification" },
      200
    );
  }
});

// @desc    Signup user verification
// @route   GET /api/auth/signup?token=${token}
// @access  Private

const userSignUpVerification = asyncHandler(async (req, res) => {
  // verify the token is correct or not for registration
  const tokenDecoded = jwt.verify(req.query.token, config.JWT_SECRET);

  // make a dummy object equal to decoded token
  const objToCheck = tokenDecoded;

  // compare the dummy object with decoded token
  const hasObject = [...tokenSet].some((setObj) =>
    Object.keys(setObj).every((key) => setObj[key] === objToCheck[key])
  );

  // only one time user can verify the token from frontend
  if (hasObject) {
    return commonErrorHandler(
      req,
      res,
      null,
      403,
      "Access denied. Token has already been used."
    );
  }

  // add the decoded token in the set
  tokenSet.add(tokenDecoded);

  if (!tokenDecoded) {
    return commonErrorHandler(req, res, null, 404, "Token is incorrect");
  }

  // access the user data with the help of decoded token
  const data = await User.findOne({ _id: tokenDecoded.id });

  // update the field isRegister in user DB
  await User.findOneAndUpdate(
    { _id: tokenDecoded.id },
    { $set: { isRegister: true } }
  );

  // final response
  return commonErrorHandler(
    req,
    res,
    { data, quote: "User registration successful" },
    201
  );
});

// @desc    Signin user
// @route   POST /api/auth/signin
// @access  Public

const userSignIn = asyncHandler(async (req, res) => {
  const body = req.body;
  const userWithEmail = await User.findOne({ email: body.email });

  // if user email id is incorrect
  if (!userWithEmail) {
    return commonErrorHandler(
      req,
      res,
      null,
      400,
      "User does not exist, please sign up"
    );
  }

  // if user password is incorrect/wrong
  const validPassword = compareHashPassword(
    body.password,
    userWithEmail.password
  );
  if (!validPassword) {
    return commonErrorHandler(req, res, null, 400, "Password is incorrect");
  }

  if (userWithEmail?.isRegister === false) {
    return commonErrorHandler(req, res, null, 400, "Account not verified ");
  }

  // create the token with the help of jwt
  const token = jwt.sign({ _id: userWithEmail._id }, config.JWT_SECRET);

  // put above token in cookies
  res.cookie("token", token, { expire: new Date() + 9999 });

  // final response
  return commonErrorHandler(
    req,
    res,
    {
      data: { token: token, details: userWithEmail },
      quote: "User Login Successful",
    },
    200
  );
});

// @desc    Signout user
// @route   POST /api/auth/signout
// @access  Private

const userSignOut = asyncHandler((req, res) => {
  // remove the token from cookie
  res.clearCookie("token");

  // final response
  return commonErrorHandler(
    req,
    res,
    { quote: "User Signout successful" },
    202
  );
});

// const middleWare = (req,res,next)=>{
//   req.locals = { Token };
//   next();
// }

const userResetPasswordMail = asyncHandler(async (req, res) => {
  // create the token for sign up verification

  const token = jwt.sign(
    { _id: req.user._id, email: req.user.email, password: req.user.password },
    config.JWT_SECRET
  );

  // read the content of html from ejs file
  const templatePath = path.join(
    __dirname + "/../",
    "views",
    "resetPasswordEmail.ejs"
  );
  const templateContent = fs.readFileSync(templatePath, "utf8");
  const EmailURL = `${config.FRONTEND_URL}/auth/reset-password?token=${token}`;

  // send an object of data to mail
  const ejsData = {
    title: "Email for Reset Password",
    link: EmailURL,
  };

  const renderedTemplate = ejs.render(templateContent, ejsData);
  sendMail(renderedTemplate, "Reset Password", req.user.email);

  // final response
  return commonErrorHandler(
    req,
    res,
    { quote: "Link sent to email for reset password" },
    200
  );
});

const userResetPassword = asyncHandler(async (req, res) => {
  const body = req.body;

  // verify the token is correct or not for registration
  const tokenDecoded = jwt.verify(req.query.token, config.JWT_SECRET);

  if (!tokenDecoded) {
    return commonErrorHandler(req, res, null, 404, "Token is incorrect");
  }

  // check the old password enter by user is correct or not
  const validPassword = compareHashPassword(
    body.oldPassword,
    tokenDecoded.password
  );
  if (!validPassword) {
    return commonErrorHandler(
      req,
      res,
      null,
      400,
      "Password is not matched with older one"
    );
  }

  // if old and new password are same
  if (body.oldPassword === body.newPassword) {
    return commonErrorHandler(
      req,
      res,
      null,
      400,
      "You cannot set this password. This password is already been used"
    );
  }

  // make a dummy object equal to decoded token
  const objToCheck = tokenDecoded;

  // compare the dummy object with decoded token
  const hasObject = [...tokenSet].some((setObj) =>
    Object.keys(setObj).every((key) => setObj[key] === objToCheck[key])
  );

  // only one time user can verify the token from frontend
  if (hasObject) {
    return commonErrorHandler(
      req,
      res,
      null,
      403,
      "Access denied. Token has already been used."
    );
  }

  // add the decoded token in the set
  tokenSet.add(tokenDecoded);
  const hashPassword = generateHashPassword(body.newPassword);

  // update the field password in user DB with new password
  await User.findOneAndUpdate(
    { _id: tokenDecoded._id },
    { $set: { password: hashPassword } }
  );

  // final response
  return commonErrorHandler(
    req,
    res,
    { quote: "User password change successfully" },
    202
  );
});


const googleAuth = asyncHandler(async(req,res)=>{
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/contacts.readonly",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ], // Scope for accessing contacts,calendar,email,profile
  });
  res.redirect(authUrl);
})

// Redirect to /google/callback api where we can exchange the authorization token to get refresh and access token
const googleAuthRedirect = asyncHandler(async(req,res)=>{
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);

  // Set access token to authorize API requests
  oauth2Client.setCredentials(tokens);

  return res.redirect(
    `${config.FRONTEND_URL}/google?oauth2Client=${JSON.stringify(oauth2Client)}`
  );
})


const googleOauthUser = asyncHandler(async(req,res)=>{
  // Manual syncing with google account
  if (!oauth2Client.credentials.refresh_token) {
    return commonErrorHandler(
      req,
      res,
      null,
      404,
      "Please, Sync with the Google first to see your contacts"
    );
  }
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  // Retreive the profile from google
  const userInfo = await oauth2.userinfo.get();
  const body = userInfo.data;
  const userWithEmail = await User.findOne({ email: body.email });

  // in case if user already sign in with google
  if (body?.email === userWithEmail?.email) {
    const token = jwt.sign({ _id: userWithEmail._id }, config.JWT_SECRET);
    return commonErrorHandler(
      req,
      res,
      { data: {token:token, details: userWithEmail}, quote: "User sign in with google successfully" },
      200
    );
    }else{
  // Login with the google for first time 
  // generate a random password so user cannot get login manually
  body.password = jwt.sign({ password: body.password }, config.JWT_SECRET);
  // save the user in database
  const user = new User({name:body.name,email:body.email,password:body.password,isRegister:true,url:body.picture});
  const data = await user.save();
  const token = jwt.sign({ _id: data._id }, config.JWT_SECRET);
  return commonErrorHandler(
    req,
    res,
    { data: {token:token, details:data}, quote: "User sign in with google successfully" },
    200
  );
  }
})

const googleContacts = asyncHandler(async(req,res)=>{
  // Manual syncing with google account
  if (!oauth2Client.credentials.refresh_token) {
    return commonErrorHandler(
      req,
      res,
      null,
      404,
      "Please, Sync with the Google first to see your contacts"
    );
  }
  const peopleApi = google.people({
    version: "v1",
    auth: oauth2Client,
  });

  try {
    // Retrieve a list of contacts
    const contacts = await peopleApi.people.connections.list({
      resourceName: "people/me",
      personFields: "names,emailAddresses", // Fields to retrieve (you can add more fields)
    });

    // Return contacts data
    const contactList = contacts.data.connections.map((contact) => {
      return contact.names[0].displayName;
    });

    return commonErrorHandler(req, res, { data: contactList, quote: "" }, 200);
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).send("Error fetching contacts");
  }
})

const calendar = google.calendar({
  version: "v3",
  auth: config.CALENDAR_API_KEY,
});

const createGoogleCalendarEvent = asyncHandler(async(req,res)=>{
  // Manual syncing with google account
  if (!oauth2Client.credentials.refresh_token) {
    return commonErrorHandler(
      req,
      res,
      null,
      404,
      "Please, Sync with the Google first to create your event in google calendar too"
    );
  }
  const body = req.body;

  // insert the same event from application in the google calendar with that google account that got sync
  const createdEvent = await calendar.events.insert({
    calendarId: "primary",
    auth: oauth2Client,
    requestBody: {
      summary: body.title,
      description: "It is a very important event",
      start: {
        dateTime: dayjs(new Date(body.startTime))
          .add(5, "hours")
          .add(30, "minutes")
          .toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: dayjs(new Date(body.endTime))
          .add(5, "hours")
          .add(30, "minutes")
          .toISOString(),
        timeZone: "Asia/Kolkata",
      },
    },
  });
  return commonErrorHandler(
    req,
    res,
    {
      data: { id: createdEvent.data.id },
      quote: "Event created in google calendar successfully",
    },
    200
  );
})

const deleteGoogleCalendarEvent = asyncHandler(async(req,res)=>{
  // Manual syncing with google account
  if (!oauth2Client.credentials.refresh_token) {
    return commonErrorHandler(
      req,
      res,
      null,
      404,
      "Please, Sync with the Google first to create your event in google calendar too"
    );
  }
  // delete the same event from application in the google calendar with that google account that got sync
  calendar.events.delete(
    {
      calendarId: "primary",
      eventId: req.params.id,
      auth: oauth2Client,
    },
    (err) => {
      if (err) {
        console.error("Error deleting event:", err);
        return;
      }
      // eslint-disable-next-line no-console
      console.log("Event deleted:");
    }
  );
  return commonErrorHandler(
    req,
    res,
    { data: {}, quote: "Event deleted in google calendar successfully" },
    200
  );
})

const updateGoogleCalendarEvent = asyncHandler(async(req,res)=>{
  // Manual syncing with google account
  if (!oauth2Client.credentials.refresh_token) {
    return commonErrorHandler(
      req,
      res,
      null,
      404,
      "Please, Sync with the Google first to create your event in google calendar too"
    );
  }
  const body = req.body;

   // update the same event from application in the google calendar with that google account that got sync
  calendar.events.update(
    {
      calendarId: "primary",
      eventId: req.params.id,
      auth: oauth2Client,
      requestBody: {
        summary: body.title,
        description: "It is a very important event",
        start: {
          dateTime: dayjs(new Date(body.startTime))
            .add(5, "hours")
            .add(30, "minutes")
            .toISOString(),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: dayjs(new Date(body.endTime))
            .add(5, "hours")
            .add(30, "minutes")
            .toISOString(),
          timeZone: "Asia/Kolkata",
        },
      },
    },
    (err) => {
      if (err) {
        console.error("Error updating event:", err);
        return;
      }
      // eslint-disable-next-line no-console
      console.log("Event updated:");
    }
  );
  return commonErrorHandler(
    req,
    res,
    { data: {}, quote: "Event updated in google calendar successfully" },
    200
  );
})

module.exports = {
  userSignUp,
  userSignIn,
  userSignOut,
  userSignUpVerification,
  userResetPassword,
  userResetPasswordMail,
  googleAuth,
  googleAuthRedirect,
  googleOauthUser,
  googleContacts,
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  updateGoogleCalendarEvent
};
