const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { commonErrorHandler } = require("../helper/errorHandler.helper");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {generateHashPassword, compareHashPassword} = require('../utils/bcryptFunctions.utils');

// @desc    Signup user
// @route   POST /api/auth/signup
// @access  Public

const userSignUp = asyncHandler(async (req, res) => {
    const body = req.body;
   

    const hash = generateHashPassword(body.password);
    
    body.password = hash;

    // if user already exist with similar email id
    const existingUser = await User.findOne({ email: body.email });
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

      // final response
      return commonErrorHandler(
        req,
        res,
        { data, quote: "User registration successful" },
        201
      );
    }
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

module.exports = { userSignUp, userSignIn, userSignOut };
