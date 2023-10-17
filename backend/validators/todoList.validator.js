const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");

const createTodoSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    status: Joi.string().valid("open", "close").default("open"),
    category: Joi.string().valid("normal", "food", "other").default("normal"),
    dateTime: Joi.date().iso().required(),
  });
  validateRequest(req, res, next, schema, "body");
};

const updateTodoSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    status: Joi.string().valid("open", "close"),
    category: Joi.string().valid("normal", "food", "other"),
    dateTime: Joi.date().iso(),
  });
  validateRequest(req, res, next, schema, "body");
};

const TodoParamSchema = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  });
  validateRequest(req, res, next, schema, "params");
};

const getTodoByQuerySchema = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    status: Joi.string().valid("open", "close"),
    category: Joi.string().valid("normal", "food", "other"),
    dateTime: Joi.date().iso(),
  });
  validateRequest(req, res, next, schema, "query");
};

module.exports = {
  createTodoSchema,
  updateTodoSchema,
  TodoParamSchema,
  getTodoByQuerySchema,
};
