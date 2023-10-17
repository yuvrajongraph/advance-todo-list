const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const authValidator = require("../validators/auth.validator");
const { commonErrorHandler } = require("../helper/errorHandler.helper");

router.post("/signup", authValidator.userSignUpSchema, authController.userSignUp);

router.post("/signin", authValidator.userSignInSchema, authController.userSignIn);

router.get("/test", isAuthenticate.verifyToken, (req, res) => {
  return commonErrorHandler(req, res, { quote: "Passed" }, 202);
});

router.post("/signout", isAuthenticate.verifyToken, authController.userSignOut);

module.exports = router;
