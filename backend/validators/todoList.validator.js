const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");


const status =  Joi.string().valid("open", "close").default("open");
const category =  Joi.string().valid("normal", "food", "other");
const dateTime =  Joi.string().isoDate();
const title = Joi.string();

// schema of create todo item in request body for validation using joi
const createTodoItemSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: title.required(),
    status,
    category: category.required(),
    dateTime: dateTime.required(),
  });
  validateRequest(req, res, next, schema, "body");
};

// schema of update todo item in request body for validation using joi
const updateTodoItemSchema = async (req, res, next) => {
  const schema = Joi.object({
    title,
    status,
    category,
    dateTime
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
    title,
    status,
    category,
    dateTime
  });
  validateRequest(req, res, next, schema, "query");
};

module.exports = {
  createTodoItemSchema,
  updateTodoItemSchema,
  getTodoItemByParamsSchema,
  getTodoItemByQuerySchema,
};
