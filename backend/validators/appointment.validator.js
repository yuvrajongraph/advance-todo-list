const Joi = require("joi");
const { validateRequest } = require("../helper/commonFunctions.helper");


const status =  Joi.string().valid("open", "close").default("open");
const startTime =  Joi.string().isoDate();
const endTime =  Joi.string().isoDate();
const title = Joi.string();


// schema of create appointment in request body for validation using joi
const createAppointmentSchema = async (req, res, next) => {
  const schema = Joi.object({
    title: title.required(),
    status,
    startTime: startTime.required(),
    endTime: endTime.required(),
  });
  validateRequest(req, res, next, schema, "body");
};

// schema of update appointment in request body for validation using joi
const updateAppointmentSchema = async (req, res, next) => {
  const schema = Joi.object({
    title,
    status,
    startTime,
    endTime
  });
  validateRequest(req, res, next, schema, "body");
};

// schema of get appointment id in request parameter for validation using joi
const getAppointmentByParamsSchema = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  });
  validateRequest(req, res, next, schema, "params");
};

// schema of get appointment any field in request query for validation using joi
const getAppointmentByQuerySchema = async (req, res, next) => {
  const schema = Joi.object({
    title,
    status,
    startTime,
    endTime
  });
  validateRequest(req, res, next, schema, "query");
};

module.exports = {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentByParamsSchema,
  getAppointmentByQuerySchema,
};
