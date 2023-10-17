const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { commonErrorHandler } = require("../helper/errorHandler.helper");

const signUp = async (req, res) => {
  try {
    const body = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    if (!salt) throw new Error();

    const hash = bcrypt.hashSync(body.password, salt);
    if (!hash) throw new Error();
    body.password = hash;

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
      const user = new User(body);
      const data = await user.save();
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
};

const signIn = async (req, res) => {
  try {
    const body = req.body;
    const userWithEmail = await User.findOne({ email: body.email });
    if (!userWithEmail) {
      return commonErrorHandler(
        req,
        res,
        null,
        400,
        "User does not exist, please sign up"
      );
    }
    const validPassword = bcrypt.compareSync(
      body.password,
      userWithEmail.password
    );
    if (!validPassword) {
      return commonErrorHandler(req, res, null, 400, "Password is incorrect");
    }
    const token = jwt.sign({ _id: userWithEmail._id }, config.JWT_SECRET);
    if (!token) throw new Error();

    res.cookie("token", token, { expire: new Date() + 9999 });
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
};

const signOut = (req, res) => {
  try {
    res.clearCookie("token");
    return commonErrorHandler(
      req,
      res,
      { quote: "User signout successful" },
      202
    );
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
};

module.exports = { signUp, signIn, signOut };
