const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");

const email = Joi.string().email().lowercase().required();
const password = Joi.string().min(3).max(30).required();
const name = Joi.string()
  .trim()
  .regex(/^\s*([^\s]+\s*)+$/)
  .replace(/\s+/g, " ")
  .required();
  const oldPassword = Joi.string().min(3).max(30).required();
  const newPassword = Joi.string().min(3).max(30).required();
  const url = Joi.string()

// schema of user signup api in request body for validation using joi
const userSignUpSchema = async (req, res, next) => {
  const schema = Joi.object({
    name,
    email,
    password,
    url
  });
  validateRequest(req, res, next, schema, "body");
};

// schema of user signin api in request body for validation using joi
const userSignInSchema = async (req, res, next) => {
  const schema = Joi.object({
    email,
    password,
  });
  validateRequest(req, res, next, schema, "body");
};


const userResetPasswordSchema = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword,
    newPassword,
  });
  validateRequest(req, res, next, schema, "body");
};

module.exports = { userSignInSchema, userSignUpSchema, userResetPasswordSchema };
