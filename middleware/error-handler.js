const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong, please try again later",
  };

  // Duplicate key error 
  if (err.code === 11000) {
    customError.msg = "Email already exists";
    customError.statusCode = 400;
  }

  // Validation errors 
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }

  // Cast error 
  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;