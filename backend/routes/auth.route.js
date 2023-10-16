const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const authValidator = require('../validators/auth.validator')

router.post(
  "/signup",
  authValidator.signUpSchema,
  authController.signUp
);

router.post(
  "/signin",
  authValidator.signInSchema,
  authController.signIn
);

router.get("/test", isAuthenticate.verifyToken, (req, res) => {
  return res.json({
    message: "Passed",
  });
});

router.get("/signout", isAuthenticate.verifyToken, authController.signOut);

module.exports = router;
