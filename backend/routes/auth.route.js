const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const authValidator = require("../validators/auth.validator");
require("../utils/googleAuth.utils");
const passport = require("passport");
const config = require("../config/config");
const { google } = require("googleapis");
const dayjs = require("dayjs");
const { commonErrorHandler } = require("../helper/errorHandler.helper");

router.post(
  "/signup",
  authValidator.userSignUpSchema,
  authController.userSignUp
);

router.post(
  "/signin",
  authValidator.userSignInSchema,
  authController.userSignIn
);

router.get("/signup", authController.userSignUpVerification);

router.post("/signout", isAuthenticate.verifyToken, authController.userSignOut);

router.get(
  "/reset-password",
  isAuthenticate.verifyToken,
  authController.userResetPasswordMail
);

router.post(
  "/reset-password",
  authValidator.userResetPasswordSchema,
  authController.userResetPassword
);

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate(
//     "google",
//     {
//       failureRedirect: "http://localhost:1010/api/auth/google/failure"
//     }
//   ),(req, res) => {

//      res.json(req.user)

// }
// );

// router.get("/google/success", authController.googleAuthSuccess);

// router.get("/google/failure", authController.googleAuthFailure);

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CONTACT_CLIENT_ID,
  config.GOOGLE_CONTACT_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);

router.get("/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/contacts.readonly",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ], // Scope for accessing contacts
  });
  res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);

  // Set access token to authorize API requests
  oauth2Client.setCredentials(tokens);

  return res.redirect(
    `http://127.0.0.1:5173/google?oauth2Client=${JSON.stringify(oauth2Client)}`
  );
  return res.json({
    message: "Login Successful by google",
  });
});

router.get("/google/oauthuser", async (req, res) => {
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
  const userInfo = await oauth2.userinfo.get();
  return commonErrorHandler(
    req,
    res,
    { data: userInfo.data, quote: "User sign in with google successfully" },
    200
  );
});

router.get("/google/contacts", async (req, res) => {
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
});
const calendar = google.calendar({
  version: "v3",
  auth: config.CALENDAR_API_KEY,
});

router.post("/google/calendar/insert", async (req, res) => {
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
});

router.delete("/google/calendar/delete/:id", async (req, res) => {
  if (!oauth2Client.credentials.refresh_token) {
    return commonErrorHandler(
      req,
      res,
      null,
      404,
      "Please, Sync with the Google first to create your event in google calendar too"
    );
  }

  calendar.events.delete(
    {
      calendarId: "primary",
      eventId: req.params.id,
      auth: oauth2Client,
    },
    (err, response) => {
      if (err) {
        console.error("Error deleting event:", err);
        return;
      }
      console.log("Event deleted:");
    }
  );
  return commonErrorHandler(
    req,
    res,
    { data: {}, quote: "Event deleted in google calendar successfully" },
    200
  );
});

router.patch("/google/calendar/update/:id", async (req, res) => {
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
    (err, response) => {
      if (err) {
        console.error("Error updating event:", err);
        return;
      }
      console.log("Event updated:");
    }
  );
  return commonErrorHandler(
    req,
    res,
    { data: {}, quote: "Event updated in google calendar successfully" },
    200
  );
});

module.exports = router;
