const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const authValidator = require("../validators/auth.validator");

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

router.post(
  "/google/signin",
  authValidator.userGoogleSignInSchema,
  authController.userGoogleSignIn
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


router.get("/google", authController.googleAuth);

router.get("/google/callback", authController.googleAuthRedirect);

router.get("/google/oauthuser", authController.googleOauthUser);

router.get("/google/contacts", authController.googleContacts);

router.post("/google/calendar/insert", authController.createGoogleCalendarEvent);

router.delete("/google/calendar/delete/:id", authController.deleteGoogleCalendarEvent);

router.patch("/google/calendar/update/:id", authController.updateGoogleCalendarEvent );

module.exports = router;
