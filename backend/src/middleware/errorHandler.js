const ApiError = require("../utils/ApiError");

/**
 * Centralized error handling middleware.
 * Catches all errors forwarded via next(err) and sends a uniform JSON response.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not already an ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error.status || 500;
    const message =
      error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || []);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Resource not found with id: ${err.value}`;
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    const message = `Duplicate field value for: ${field}`;
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ApiError(400, message);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please log in again.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired. Please log in again.");
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
  };

  // Include error stack in development mode
  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
    if (error.errors && error.errors.length > 0) {
      response.errors = error.errors;
    }
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
