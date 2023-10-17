const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");

// schema of create todo item in request body for validation using joi
const createTodoItemSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    status: Joi.string().valid("open", "close").default("open"),
    category: Joi.string().valid("normal", "food", "other").default("normal"),
    dateTime: Joi.date().iso().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

// schema of update todo item in request body for validation using joi
const updateTodoItemSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    status: Joi.string().valid("open", "close"),
    category: Joi.string().valid("normal", "food", "other"),
    dateTime: Joi.date().iso(),
  });
  validateRequest(req, res, next, schema, "body");
};

// schema of get todo item id in request parameter for validation using joi
const getTodoItemByParamsSchema = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  });
  validateRequest(req, res, next, schema, "params");
};

// schema of get todo item any field in request query for validation using joi
const getTodoItemByQuerySchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    status: Joi.string().valid("open", "close"),
    category: Joi.string().valid("normal", "food", "other"),
    dateTime: Joi.date().iso(),
  });
  validateRequest(req, res, next, schema, "query");
};

module.exports = {
  createTodoItemSchema,
  updateTodoItemSchema,
  getTodoItemByParamsSchema,
  getTodoItemByQuerySchema,
};
