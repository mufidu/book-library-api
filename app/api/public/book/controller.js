const { StatusCodes } = require("http-status-codes");
const {
    showAllBooks
} = require("../../../service/sequelize/public/book");

const showBooks = async (req, res, next) => {
    try {
        const result = await showAllBooks();

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    showBooks,
};
