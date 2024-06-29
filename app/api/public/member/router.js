const express = require("express");
const { showMembers } = require("./controller");
const router = express();

router.get("/public/members", showMembers);

module.exports = router;
