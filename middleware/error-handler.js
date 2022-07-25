const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err, err.name, err.code);
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  } else if (err.name === "MongoError" && err.code === 11000) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ msg: `Duplicated {${Object.keys(err.keyValue)}} error` });
  } else if (err.name === "CastError") {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "not found " });
  } else if (err.name === "ValidationError") {
    return res.status(StatusCodes.NETWORK_AUTHENTICATION_REQUIRED).json({
      msg: Object.values(err.errors).map((e) => e.message),
    });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

module.exports = errorHandlerMiddleware;
