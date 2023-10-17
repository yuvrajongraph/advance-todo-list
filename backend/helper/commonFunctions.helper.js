const { commonErrorHandler } = require("./errorHandler.helper");

const validateRequest = (req, res, next, schema, requestParamterType) => {
  // error handling for validators
  let requestData = {};
  if (requestParamterType === "body") {
    requestData = req.body;
  } else if (requestParamterType === "query") {
    requestData = req.query;
  } else {
    requestData = req.params;
  }

  // validate the schema of request body
  const { error, value } = schema.validate(requestData);

  if (!error) {
    if (requestParamterType === "body") {
      req.body = value;
    } else if (requestParamterType === "query") {
      req.query = value;
    } else {
      req.params = value;
    }
    return next();
  }

  const { details } = error;
  // iterate in details array of present error
  const message = details.map((i) => i.message).join(",");
  return commonErrorHandler(req, res, null, 422, message);
};

module.exports = {
  validateRequest,
};
