const { StatusCodes } = require("http-status-codes");
const {
    showAllMembers
} = require("../../../service/sequelize/public/member");

const showMembers = async (req, res, next) => {
    try {
        const result = await showAllMembers();

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
    showMembers,
};
