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

    // Check if member has borrowed >= 2 books
    if (member.booksBorrowed >= 2) {
        throw new BadRequestError("Member has borrowed >= 2 books");
    }

    // If member is penalized, check if it has been penalized for more than 3 days
    if (member.isPenalized) {
        const datePenalized = member.datePenalized;
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - datePenalized);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 3) {
            throw new BadRequestError("Member is currently being penalized");
        }

        member.isPenalized = false;
        member.datePenalized = null;
        await member.save();
    }

    // Check if book is out of stock
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

const returnBook = async (req) => {
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

    const memberBook = await MemberBook.findOne({
        where: { BookId: bookId, MemberId: member.id },
    });

    if (!memberBook) {
        throw new BadRequestError("Book is not borrowed by member");
    }

    // Calculate the difference between the date returned and the date borrowed
    const dateReturned = new Date();
    const dateBorrowed = memberBook.dateBorrowed;
    const diffTime = Math.abs(dateReturned - dateBorrowed);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If the book is returned after more than 7 days, the member will be subject to a penalty
    if (diffDays > 7) {
        member.isPenalized = true;
        member.datePenalized = new Date();
        await member.save();
    }

    member.booksBorrowed -= 1;
    await member.save();

    book.stock += 1;
    await book.save();

    await memberBook.destroy();

    return {
        book,
        member,
        memberBook,
        dateReturned,
        diffDays,
    };
}

module.exports = {
    borrowBook,
    getBorrowedBooks,
    returnBook,
};
