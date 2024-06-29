const { StatusCodes } = require("http-status-codes");
const {
    registerMember,
    loginMember,
} = require("../../../service/sequelize/member/auth");

const register = async (req, res, next) => {
    try {
        const result = await registerMember(req);

        res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await loginMember(req);

        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            msg: "OK",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
};
