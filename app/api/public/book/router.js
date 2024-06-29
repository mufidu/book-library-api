const express = require("express");
const { showBooks } = require("./controller");
const router = express();

router.get("/public/books", showBooks);

module.exports = router;
