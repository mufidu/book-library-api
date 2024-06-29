const express = require("express");
const { borrow, getBorrowed, returnBorrowed } = require("./controller");
const { authenticateMemberToken } = require("../../../middlewares/auth");
const router = express();

router.post("/member/book/borrow", authenticateMemberToken, borrow);
router.get("/member/book/borrow", authenticateMemberToken, getBorrowed);
router.post("/member/book/return", authenticateMemberToken, returnBorrowed);

module.exports = router;
