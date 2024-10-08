// import express and route module
const express = require("express");
const router = express.Router();


const authMiddleware = require("../MiddleWare/authMiddleware");

//question controllers
const {
  submitQuestion,
  getAllQuestions,
  getSingleQuestion,
} = require("../Controller/questionControllers");

//Get All Questions
router.get("/", authMiddleware, getAllQuestions);

//Get Single Question
router.get("/:question_id", authMiddleware, getSingleQuestion);

//Post Question
router.post("/", authMiddleware, submitQuestion);

module.exports = router;
