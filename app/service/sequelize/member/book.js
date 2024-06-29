const { BadRequestError, NotFoundError } = require("../../../errors");
const { sequelize } = require("../../../../models");
const Member = require("../../../../models").Member;
const Book = require("../../../../models").Book;
const MemberBook = require("../../../../models").MemberBook;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

const borrowBook = async (req) => {
    const { id } = req.user.member;
    const { bookId } = req.body;

    const member = await Member.findOne({
        where: { id },
    });

    const book = await sequelize.models.Book.findOne({
        where: { id: bookId },
    });

    if (!book) {
        throw new NotFoundError("Book not found");
    }

    if (member.booksBorrowed >= 2) {
        throw new BadRequestError("Member has borrowed >= 2 books");
    }

    if (member.isPenalized) {
        throw new BadRequestError("Member is currently being penalized");
    }

    if (book.stock <= 0) {
        throw new BadRequestError("Book is out of stock");
    }

    const memberBook = await MemberBook.findOne({
        where: { BookId: bookId, MemberId: member.id },
    });

    if (memberBook) {
        throw new BadRequestError("Book is already borrowed by member");
    }

    const newMemberBook = await MemberBook.create({
        BookId: bookId,
        MemberId: member.id,
        dateBorrowed: new Date(),
    });

    member.booksBorrowed += 1;
    await member.save();

    book.stock -= 1;
    await book.save();

    return {
        book,
        member,
        memberBook: newMemberBook,
    };
}

const getBorrowedBooks = async (req) => {
    const { id } = req.user.member;

    const member = await Member.findOne({
        where: { id },
    });

    const borrowedBooks = await member.getBooks();

    return borrowedBooks;
}

module.exports = {
    borrowBook,
    getBorrowedBooks,
};
