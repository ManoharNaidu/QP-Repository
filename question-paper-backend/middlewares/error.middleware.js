const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error("Error:", error);

    // Handle specific error types
    if (err.name === "CastError") {
      // Mongoose bad ObjectId
      error.message = "Resource not found";
      error.statusCode = 404;
    } else if (err.code === 11000) {
      // Mongoose duplicate key
      error.message = "Duplicate field value entered";
      error.statusCode = 400;
    } else if (err.name === "ValidationError") {
      // Mongoose validation error
      error.message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      error.statusCode = 400;
    }

    // Send the response
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (error) {
    // If something goes wrong in the error middleware, pass it to the default error handler
    next(error);
  }
};

export default errorMiddleware;