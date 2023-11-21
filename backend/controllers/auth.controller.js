const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { commonErrorHandler } = require("../helper/errorHandler.helper");
const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {
  generateHashPassword,
  compareHashPassword,
} = require("../utils/bcryptFunctions.utils");
const { sendMail } = require("../utils/sendMail.utils");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
// const UniqueStringGenerator = require("unique-string-generator");
const tokenSet = new Set();
// const randomToken = UniqueStringGenerator.UniqueString();
// let Token ;

// @desc    Signup user
// @route   POST /api/auth/signup
// @access  Public

const userSignUp = asyncHandler(async (req, res) => {
  const body = req.body;

  const hash = generateHashPassword(body.password);

  body.password = hash;

  // if user already exist with similar email id
  const existingUser = await User.findOne({
    $and: [{ email: body.email }, { isRegister: true }],
  });
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
    console.log(data)
    // create the token for sign up verification
    const token = jwt.sign(
      { email: data.email, id: data._id },
      config.JWT_SECRET
    );
    // Token = token;

    // read the content of html from ejs file
    const templatePath = path.join(
      __dirname + "/../",
      "views",
      "signupEmail.ejs"
    );
    const templateContent = fs.readFileSync(templatePath, "utf8");
    const EmailURL = `${config.FRONTEND_URL}/auth/signup?token=${token}`;

    // send an object of data to mail
    const ejsData = {
      title: "Email for Signup verification",
      link: EmailURL,
    };

    const renderedTemplate = ejs.render(templateContent, ejsData);
    sendMail(renderedTemplate, "Sign up", data.email);

    // final response
    return commonErrorHandler(
      req,
      res,
      { quote: "Link sent to email for verification" },
      200
    );
  }
});

// @desc    Signup user verification
// @route   GET /api/auth/signup?token=${token}
// @access  Private

const userSignUpVerification = asyncHandler(async (req, res) => {
  // verify the token is correct or not for registration
  const tokenDecoded = jwt.verify(req.query.token, config.JWT_SECRET);

  // make a dummy object equal to decoded token
  const objToCheck = tokenDecoded;

  // compare the dummy object with decoded token
  const hasObject = [...tokenSet].some((setObj) =>
    Object.keys(setObj).every((key) => setObj[key] === objToCheck[key])
  );

  // only one time user can verify the token from frontend
  if (hasObject) {
    return commonErrorHandler(
      req,
      res,
      null,
      403,
      "Access denied. Token has already been used."
    );
  }

  // add the decoded token in the set
  tokenSet.add(tokenDecoded);

  if (!tokenDecoded) {
    return commonErrorHandler(req, res, null, 404, "Token is incorrect");
  }

  // access the user data with the help of decoded token
  const data = await User.findOne({ _id: tokenDecoded.id });

  // update the field isRegister in user DB
  await User.findOneAndUpdate(
    { _id: tokenDecoded.id },
    { $set: { isRegister: true } }
  );

  // final response
  return commonErrorHandler(
    req,
    res,
    { data, quote: "User registration successful" },
    201
  );
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

  if (userWithEmail?.isRegister === false) {
    return commonErrorHandler(req, res, null, 400, "Account not verified ");
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

// const middleWare = (req,res,next)=>{
//   req.locals = { Token };
//   next();
// }

const userResetPasswordMail = asyncHandler(async (req, res) => {
  // create the token for sign up verification

  const token = jwt.sign(
    { _id: req.user._id, email: req.user.email, password: req.user.password },
    config.JWT_SECRET
  );

  // read the content of html from ejs file
  const templatePath = path.join(
    __dirname + "/../",
    "views",
    "resetPasswordEmail.ejs"
  );
  const templateContent = fs.readFileSync(templatePath, "utf8");
  const EmailURL = `${config.FRONTEND_URL}/auth/reset-password?token=${token}`;

  // send an object of data to mail
  const ejsData = {
    title: "Email for Reset Password",
    link: EmailURL,
  };

  const renderedTemplate = ejs.render(templateContent, ejsData);
  sendMail(renderedTemplate, "Reset Password", req.user.email);

  // final response
  return commonErrorHandler(
    req,
    res,
    { quote: "Link sent to email for reset password" },
    200
  );
});

const userResetPassword = asyncHandler(async (req, res) => {
  const body = req.body;

  // verify the token is correct or not for registration
  const tokenDecoded = jwt.verify(req.query.token, config.JWT_SECRET);

  if (!tokenDecoded) {
    return commonErrorHandler(req, res, null, 404, "Token is incorrect");
  }

  // check the old password enter by user is correct or not
  const validPassword = compareHashPassword(
    body.oldPassword,
    tokenDecoded.password
  );
  if (!validPassword) {
    return commonErrorHandler(
      req,
      res,
      null,
      400,
      "Password is not matched with older one"
    );
  }

  // if old and new password are same
  if (body.oldPassword === body.newPassword) {
    return commonErrorHandler(
      req,
      res,
      null,
      400,
      "You cannot set this password. This password is already been used"
    );
  }

  // make a dummy object equal to decoded token
  const objToCheck = tokenDecoded;

  // compare the dummy object with decoded token
  const hasObject = [...tokenSet].some((setObj) =>
    Object.keys(setObj).every((key) => setObj[key] === objToCheck[key])
  );

  // only one time user can verify the token from frontend
  if (hasObject) {
    return commonErrorHandler(
      req,
      res,
      null,
      403,
      "Access denied. Token has already been used."
    );
  }

  // add the decoded token in the set
  tokenSet.add(tokenDecoded);
  const hashPassword = generateHashPassword(body.newPassword);
  
  // update the field password in user DB with new password
  await User.findOneAndUpdate(
    { _id: tokenDecoded._id },
    { $set: { password: hashPassword } }
  );

  // final response
  return commonErrorHandler(
    req,
    res,
    { quote: "User password change successfully" },
    202
  );
});

const googleAuthSuccess = (req,res)=>{
  console.log(req.user)
   return commonErrorHandler(
    req,
    res,
    { data: req.user.displayName, quote: "User login success by google" },
    202
  );
 
}

const googleAuthFailure = asyncHandler(async(req,res)=>{
  return res.send("Fail authentication!!")
})

module.exports = {
  userSignUp,
  userSignIn,
  userSignOut,
  userSignUpVerification,
  userResetPassword,
  userResetPasswordMail,
  googleAuthSuccess,
  googleAuthFailure
};
