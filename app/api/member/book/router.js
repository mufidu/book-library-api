const express = require("express");
const { borrow, getBorrowed } = require("./controller");
const { authenticateMemberToken } = require("../../../middlewares/auth");
const router = express();

router.post("/member/book/borrow", authenticateMemberToken, borrow);
router.get("/member/book/borrow", authenticateMemberToken, getBorrowed);

module.exports = router;
