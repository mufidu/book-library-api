const { BadRequestError, NotFoundError } = require("../../../errors");
const Member = require("../../../../models").Member;
const Book = require("../../../../models").Book;
const MemberBook = require("../../../../models").MemberBook;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

/**
 * @swagger
 * /api/public/members:
 *   get:
 *     summary: Retrieves all members
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: A list of all members.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Member'
 *       500:
 *         description: Internal server error
 */
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