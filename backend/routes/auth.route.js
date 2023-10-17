const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const authValidator = require("../validators/auth.validator");
const { commonErrorHandler } = require("../helper/errorHandler.helper");

router.post("/signup", authValidator.signUpSchema, authController.signUp);

router.post("/signin", authValidator.signInSchema, authController.signIn);

router.get("/test", isAuthenticate.verifyToken, (req, res) => {
  return commonErrorHandler(req, res, { quote: "Passed" }, 202);
});

router.get("/signout", isAuthenticate.verifyToken, authController.signOut);

module.exports = router;
