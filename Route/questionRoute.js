//import express and route module
const express = require("express");
const router = express.Router();

//question controllers
const {
  allQuestions,
  singleQuestion,
  submitQuestion,
} = require("../Controller/questionControllers");

//Get All Questions
router.get("/", allQuestions);

//Get Single Question
router.get("/:question_id", singleQuestion);

//Post Question
router.post("/", submitQuestion);

module.exports = router;
