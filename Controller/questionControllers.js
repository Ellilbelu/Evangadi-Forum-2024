const dbConnection = require("../Database/dbConfig");
const { v4: uuidv4 } = require("uuid"); // Universally unique identifier
const { StatusCodes } = require("http-status-codes");

async function getAllQuestions(req, res) {
  try {
    // Query to get all questions along with their associated user details
    const [questions] = await dbConnection.query(
      "SELECT * FROM questions, users WHERE questions.userid = users.userid"
    );

    // Check if no questions were found
    if (questions.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found" });
    }

    // Respond with the list of questions
    return res
      .status(StatusCodes.OK)
      .json({ msg: "All questions appeared", questions });
  } catch (error) {
    console.log(error.message); // Log the error message
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

//--------------------------------------- Get Single Question Function ------------------------------------------
async function getSingleQuestion(req, res) {
  const { question_id } = req.params; // Extracting the question ID from the request parameters
  try {
    // Query to get a specific question based on the question ID
    const [singleQuestion] = await dbConnection.query(
      "SELECT * FROM questions, users WHERE questions.userid = users.userid AND questionid =?",
      [question_id]
    );

    // Check if the question was found
    if (singleQuestion.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The requested question could not be found." });
    }

    // Respond with the single question details
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Here is the question", singleQuestion });
  } catch (error) {
    console.log(error.message); // Log the error message
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

// a function to submit a question in to the data base
async function submitQuestion(req, res) {
  const { title, tag, description } = req.body; // Destructuring the request body to get the question details
  // Validate that title and description are provided
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const questionid = uuidv4(); // Generate a unique ID for the question
    const userid = req.user.userid; // Get the user ID from the request object

    // Insert the new question into the database
    await dbConnection.query(
      "INSERT INTO questions (userid, questionid, title, tag, description) VALUES (?,?,?,?,?)",
      [userid, questionid, title, tag, description]
    );

    // Respond with a success message
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Your question is posted" });
  } catch (error) {
    console.log(error.message); // Log the error message
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}
module.exports = { getAllQuestions, getSingleQuestion, submitQuestion };
