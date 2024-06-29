const { StatusCodes } = require("http-status-codes");

const notFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        msg: "Route does not exist",
        data: null,
    });
};

module.exports = notFound;
