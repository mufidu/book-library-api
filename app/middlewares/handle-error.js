const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, try again later",
    };
    if (err.name === "SequelizeValidationError") {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");
        customError.statusCode = 400;
    }
    if (err.code && err.code === "auth/argument-error") {
        customError.msg = "Invalid ID Token";
    }
    if (err.original && err.original.code === "ECONNREFUSED") {
        customError.msg = `Database Connection Error: ${err.original.code}`;
    }
    return res.status(customError.statusCode).json({
        status: customError.statusCode,
        msg: customError.msg,
        data: null,
    });
};

module.exports = errorHandlerMiddleware;
