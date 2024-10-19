// const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const express = require("express");
const dbConnection = require("../Database/dbConfig");

// const router = express.Router();

async function getTaggedQuestions(req, res) {
  const { tags } = req.query;

  console.log(tags);

  if (!tags) {
    return res.status(400).json({ message: "Invalid tags parameter" });
  }

  try {
    const tagArray = tags.split(",").map((tag) => tag.trim());

    const tagConditions = tagArray
      .map(() => `FIND_IN_SET(?, q.tag)`)
      .join(" OR ");

    const [rows] = await dbConnection.execute(
      `SELECT q.id, q.title, q.description, q.tag, a.answer
       FROM questions q, answers a 
       WHERE q.questionid=a.questionid and ${tagConditions}`,
      tagArray
    );

    res.json(rows);
  } catch (error) {
    // console.log(error.message);
    console.error("Error fetching questions by tags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getTaggedQuestions };
// module.exports = router;
