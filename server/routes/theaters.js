const express = require("express");
const router = express.Router();

const { createTheater, getTheaters, bookShow } = require("../controllers/theaters");

router.route("/").get(getTheaters);
router.route("/").post(createTheater);
router.route("/book").post(bookShow);

module.exports = router;
