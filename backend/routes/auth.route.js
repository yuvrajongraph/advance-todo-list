const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const authValidator = require("../validators/auth.validator");
require("../utils/googleAuth.utils");
const passport = require("passport");
const config = require("../config/config");
const { google } = require("googleapis");

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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate(
    "google",
    {
      failureRedirect: "http://localhost:1010/api/auth/google/failure"
    }
  ),(req, res) => {
    return res.json(req.user)
}
);

router.get("/google/success", authController.googleAuthSuccess);

router.get("/google/failure", authController.googleAuthFailure);

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CONTACT_CLIENT_ID,
  config.GOOGLE_CONTACT_CLIENT_SECRET,
  "http://localhost:1010/api/auth/google/contact/callback"
);

router.get("/google/contact", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/contacts.readonly"], // Scope for accessing contacts
  });
  res.redirect(authUrl);
});

router.get(
  "/google/contact/callback",async(req,res)=>{
    const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  
  // Set access token to authorize API requests
  oauth2Client.setCredentials(tokens);
   
  const peopleApi = google.people({
    version: 'v1',
    auth: oauth2Client,
  });

  try {
    // Retrieve a list of contacts
    const contacts = await peopleApi.people.connections.list({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses', // Fields to retrieve (you can add more fields)
    });

    // Return contacts data
    const contactList = contacts.data.connections.map((contact)=>{
      return contact.names[0].displayName
    })
  
    res.json(contactList);
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    res.status(500).send('Error fetching contacts');
  }
  }
);

module.exports = router;
