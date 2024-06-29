const { BadRequestError, NotFoundError } = require("../../../errors");
const Member = require("../../../../models").Member;
const Book = require("../../../../models").Book;
const MemberBook = require("../../../../models").MemberBook;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

// Member check
//  Shows all existing members
//  The number of books being borrowed by each member

const showAllMembers = async () => {
    const members = await Member.findAll({
        include: {
            model: Book,
            through: {
                model: MemberBook,
                attributes: [],
            },
            attributes: [],
        },
    });

    return {
        members,
    };
}

module.exports = {
    showAllMembers,
};