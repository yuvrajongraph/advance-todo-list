const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { commonErrorHandler } = require("../helper/errorHandler.helper");

const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header ? header.split(" ")[1] : null;

    if (!token) {
      return commonErrorHandler(req, res, null, 401, "Access Denied");
    }

    if (token !== req.cookies.token) {
      return commonErrorHandler(req, res, null, 401, "Access Denied");
    }

    let decoded_jwt = jwt.verify(token, config.JWT_SECRET);
    if (!decoded_jwt) throw new Error();

    const user = await User.findOne({ _id: decoded_jwt._id });
    if (!user) {
      return commonErrorHandler(req, res, null, 401, "User not found");
    }
    req.user = user;

    next();
  } catch (error) {
    return commonErrorHandler(req, res, null, 500, error);
  }
};

module.exports = { verifyToken };
