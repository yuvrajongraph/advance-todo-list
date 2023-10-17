const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { commonErrorHandler } = require("../helper/errorHandler.helper");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");

// @desc    Signup user
// @route   POST /api/auth/signup
// @access  Public

const userSignUp = asyncHandler(async (req, res) => {
  try {
    const body = req.body;
    const saltRounds = 10;

    // if any problem present in bcrypt module or syntax
    const salt = bcrypt.genSaltSync(saltRounds);
    if (!salt) throw new Error();
    const hash = bcrypt.hashSync(body.password, salt);
    if (!hash) throw new Error();
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
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
});

// @desc    Signin user
// @route   POST /api/auth/signin
// @access  Public

const userSignIn = asyncHandler(async (req, res) => {
  try {
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
    const validPassword = bcrypt.compareSync(
      body.password,
      userWithEmail.password
    );
    if (!validPassword) {
      return commonErrorHandler(req, res, null, 400, "Password is incorrect");
    }

    // create the token with the help of jwt
    const token = jwt.sign({ _id: userWithEmail._id }, config.JWT_SECRET);
    if (!token) throw new Error();

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
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
});

// @desc    Signout user
// @route   POST /api/auth/signout
// @access  Private

const userSignOut = asyncHandler((req, res) => {
  try {
    // remove the token from cookie
    res.clearCookie("token");

    // final response
    return commonErrorHandler(
      req,
      res,
      { quote: "User Signout successful" },
      202
    );
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
});

module.exports = { userSignUp, userSignIn, userSignOut };
