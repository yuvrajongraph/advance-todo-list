const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const authValidator = require("../validators/auth.validator");
require('../utils/googleAuth.utils')
const passport = require('passport')

router.post("/signup", authValidator.userSignUpSchema, authController.userSignUp);

router.post("/signin", authValidator.userSignInSchema, authController.userSignIn);

router.get("/signup", authController.userSignUpVerification);

router.post("/signout", isAuthenticate.verifyToken, authController.userSignOut);

router.get("/reset-password",isAuthenticate.verifyToken, authController.userResetPasswordMail);

router.post("/reset-password",authValidator.userResetPasswordSchema, authController.userResetPassword);

router.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/api/auth/google/success',
        failureRedirect: '/api/auth/google/failure'
}));

router.get('/google/success',isAuthenticate.verifyToken,authController.googleAuthSuccess)

router.get('/google/failure',authController.googleAuthFailure)

module.exports = router;
