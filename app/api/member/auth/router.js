const express = require("express");
const { register, login } = require("./controller");
const router = express();

router.post("/member/auth/register", register);
router.post("/member/auth/login", login);

module.exports = router;
