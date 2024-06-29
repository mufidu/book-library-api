const { BadRequestError, NotFoundError } = require("../../../errors");
const Member = require("../../../../models").Member;
const Book = require("../../../../models").Book;
const MemberBook = require("../../../../models").MemberBook;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

const showAllBooks = async () => {
    const books = await Book.findAll({
        include: {
            model: Member,
            through: {
                model: MemberBook,
                attributes: [],
            },
            attributes: [],
        },
    });

    // If book.stock is 0, remove the book from the list
    const filteredBooks = books.filter((book) => book.stock > 0);
    return {
        books: filteredBooks,
    };
}

module.exports = {
    showAllBooks,
};