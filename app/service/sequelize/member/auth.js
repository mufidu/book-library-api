const validator = require("validator");
const { BadRequestError, NotFoundError } = require("../../../errors");
const { sequelize } = require("../../../../models");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Member = require("../../../../models").Member;
const config = require("../../../../config/environment-config");
config.loadEnvironmentVariables();

/**
 * @swagger
 * /api/member/register:
 *   post:
 *     summary: Register a new member
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - password
 *             properties:
 *               code:
 *                  type: string
 *                  description: Member's code
 *               name:
 *                 type: string
 *                 description: Member's name
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Member's password
 *     responses:
 *       200:
 *         description: Member registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member:
 *                   $ref: '#/components/schemas/Member'
 *                 token:
 *                   type: string
 *                   description: JWT token for the registered member
 *       400:
 *         description: Bad request
 *       404:
 *         description: Member not found
 */
const registerMember = async (req) => {
	const { code, name, password } = req.body;

	if (!name || !password) {
		throw new BadRequestError("Name and password is required");
	}

	// Check if name exists in PostgreSQL database
	const member = await Member.findOne({ where: { name } });
	if (member) {
		throw new BadRequestError("Name already exists");
	}

	// Validate name
	const isName = await validator.isAlphanumeric(name);
	if (!isName) {
		throw new BadRequestError("Invalid Name");
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
				name: name,
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

/**
 * @swagger
 * /api/member/login:
 *   post:
 *     summary: Login a member
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Member's name
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Member's password
 *     responses:
 *       200:
 *         description: Member logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member:
 *                   $ref: '#/components/schemas/Member'
 *                 token:
 *                   type: string
 *                   description: JWT token for the logged in member
 *       400:
 *         description: Bad request
 *       404:
 *         description: Member not found
 */
const loginMember = async (req) => {
	const { name, password } = req.body;

	if (!name || !password) {
		throw new BadRequestError("Name and password is required");
	}

	const member = await Member.findOne({ where: { name } });
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
