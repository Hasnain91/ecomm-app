const express = require("express");
const { subscribeToNewsletter } = require("../controllers/mailController");

const router = express.Router();

router.post("/subscribe", subscribeToNewsletter);

module.exports = router;
