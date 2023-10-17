const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { validateRequest } = require("../helper/commonFunctions.helper");

const complexityOptions = {
  min: 3,
  max: 16,
};

// schema of user signup api in request body for validation using joi
const userSignUpSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
  });
  validateRequest(req, res, next, schema, "body");
};

// schema of user signin api in request body for validation using joi
const userSignInSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
  });
  validateRequest(req, res, next, schema, "body");
};

module.exports = { userSignInSchema, userSignUpSchema };
