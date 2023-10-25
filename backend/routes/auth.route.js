const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const isAuthenticate = require("../middlewares/auth.middleware");
const authValidator = require("../validators/auth.validator");


router.post("/signup", authValidator.userSignUpSchema, authController.userSignUp);

router.post("/signin", authValidator.userSignInSchema, authController.userSignIn);

router.get("/signup", authController.userSignUpVerification);

router.post("/signout", isAuthenticate.verifyToken, authController.userSignOut);



module.exports = router;
