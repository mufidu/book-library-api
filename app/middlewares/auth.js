const jwt = require("jsonwebtoken");
const config = require("../../config/environment-config");
config.loadEnvironmentVariables();
const {
    UnauthorizedError,
    UnauthenticatedError,
    BadRequestError,
} = require("../errors");

const authenticateMemberToken = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
        }
        if (!token) {
            throw new UnauthorizedError("Authorization Invalid");
        }

        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!data) {
            throw new UnauthenticatedError("Token Invalid");
        }
        if (!data.member) {
            throw new BadRequestError("Invalid Token");
        }
        req.user = data;

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    authenticateMemberToken,
};
