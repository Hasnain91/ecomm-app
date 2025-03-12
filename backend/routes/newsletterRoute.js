const express = require("express");
const {
  subscribeToNewsletter,
} = require("../controllers/newslettercontroller");

const router = express.Router();

router.post("/subscribe", subscribeToNewsletter);

module.exports = router;
