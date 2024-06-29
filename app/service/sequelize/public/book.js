const { BadRequestError, NotFoundError } = require("../../../errors");
const Member = require("../../../../models").Member;
const Book = require("../../../../models").Book;
const MemberBook = require("../../../../models").MemberBook;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

/**
 * @swagger
 * /api/public/books:
 *   get:
 *     summary: Retrieves all books with stock greater than 0
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
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