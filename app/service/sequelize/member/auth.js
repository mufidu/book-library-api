const validator = require("validator");
const { BadRequestError, NotFoundError } = require("../../../errors");
const { sequelize } = require("../../../../models");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Member = require("../../../../models").Member;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

const registerMember = async (req) => {
    const { code, username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError("Username and password is required");
    }

    // Check if username exists in PostgreSQL database
    const member = await Member.findOne({ where: { username } });
    if (member) {
        throw new BadRequestError("Username already exists");
    }

    // Validate username
    const isUsername = await validator.isAlphanumeric(username);
    if (!isUsername) {
        throw new BadRequestError("Invalid Username");
    }

    // Validate password
    const strongPassword = await validator.isStrongPassword(password);
    if (!strongPassword) {
        throw new BadRequestError("Weak Password");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await sequelize.transaction(async (t) => {
        const sequelizeMember = await Member.create(
            {
                code: code,
                username: username,
                password: hashedPassword,
                booksBorrowed: 0,
                isPenalized: false,
                datePenalized: null,
            },
            {
                transaction: t,
            },
        );
        return sequelizeMember;
    });

    return result;
};

const loginMember = async (req) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError("Username and password is required");
    }

    const member = await Member.findOne({ where: { username } });
    if (!member) {
        throw new NotFoundError("Member not found");
    }

    const match = await bcrypt.compare(password, member.password);
    if (!match) {
        throw new BadRequestError("Incorrect password");
    }

    // Member is authenticated, generate a JWT
    const token = jwt.sign({ member: member }, process.env.JWT_SECRET_KEY, {
        expiresIn: parseInt(process.env.JWT_EXPIRATION, 10),
    });

    return { member, token };
};

module.exports = {
    registerMember,
    loginMember,
};
