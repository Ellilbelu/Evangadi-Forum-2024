const dbConnection = require("../Database/dbConfig");
const { v4 : uuidv4} = require("uuid");  // Universally unique identifier
const { StatusCodes } = require("http-status-codes");

// a function to retrieve all the questions from the data base
async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query("SELECT * FROM questions");
    if (questions.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "there are no questions in the database" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ msg: "All questions appeared", questions });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong,Try again later" });
  }
}

// a function to retrieve a single question from the data base
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;
  try {
    const [singleQuestion] = await dbConnection.query(
      "SELECT * FROM questions WHERE id =?",
      [question_id]
    );
    if (singleQuestion.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The question you are looking for could not be found." });
    }
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Here is the question", singleQuestion });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong,Try again later" });
  }
}

// a function to submit a question in to the data base
async function submitQuestion(req, res) {
  const { title, description, tag } = req.body;
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const questionid = uuidv4();
    const userid = req.user.userid;
    await dbConnection.query(
      "INSERT INTO questions (userid, questionid, title, description, tag) VALUES (?,?,?,?,?)",
      [userid, questionid, title, description, tag]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "New question is created or submited to the database" });
    // console.log(error.message)
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong,Try again later" });
  }
}

module.exports = { getAllQuestions, getSingleQuestion, submitQuestion };

