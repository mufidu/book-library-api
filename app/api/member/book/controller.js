const { StatusCodes } = require("http-status-codes");
const {
    borrowBook,
    getBorrowedBooks,
    returnBook,
} = require("../../../service/sequelize/member/book");

const borrow = async (req, res, next) => {
    try {
        const result = await borrowBook(req);

        res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getBorrowed = async (req, res, next) => {
    try {
        const result = await getBorrowedBooks(req);

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

const returnBorrowed = async (req, res, next) => {
    try {
        const result = await returnBook(req);

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    borrow,
    getBorrowed,
    returnBorrowed,
};
