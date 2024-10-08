//import express and route module
const express = require("express");
const router = express.Router();

//a middleware to create a protected routes
const authMiddleware = require("../MiddleWare/authMiddleware");

//answer controllers
const { submitAnswer, getAnswer } = require("../Controller/answerControllers");

//Get answer for a specific question middleware
router.get("/:question_id",authMiddleware, getAnswer);

//Post Answers for a Question
router.post("/", authMiddleware
    , submitAnswer);

module.exports = router;
