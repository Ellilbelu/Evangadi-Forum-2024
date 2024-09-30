//import express and route module
const express = require("express");
const router = express.Router();

//answer controllers
const { submitAnswer, getAnswer } = require("../Controller/answerControllers");

//Get answer for a specific question middleware
router.get("/:question_id", getAnswer);

//Post Answers for a Question
router.post("/", submitAnswer);

module.exports = router;
