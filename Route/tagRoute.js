const express = require("express");
const router = express.Router();
const { getTaggedQuestions } = require("../Controller/tagController.js");

// Authentication middleware
// const authMiddleware = require("../Middleware/authMiddleware");

// Route to get tagged questions
router.get("/by-tags", getTaggedQuestions);

module.exports = router;
