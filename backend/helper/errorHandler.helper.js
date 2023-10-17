const fs = require("fs");

const commonErrorHandler = async (
  req,
  res,
  message,
  statusCode = 500,
  error = null
) => {
  // all errors handle in the code by this
  let errorMessage = "Something went wrong. Please try again";
  if (message) {
    errorMessage = message;
  }

  if (error || error?.message) {
    errorMessage = error.message ? error.message : error;
  }
  req.error = error;

  // send response for every api
  const response = {
    statusCode,
    data: errorMessage.data ? errorMessage.data : {},
    message: errorMessage.quote ? errorMessage.quote : errorMessage,
  };
  if (errorMessage === error || errorMessage === error?.message) {
    delete response.message;
    response.error = errorMessage;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  commonErrorHandler,
};
