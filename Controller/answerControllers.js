const dbConnection = require("../Database/dbConfig");
const { StatusCodes } = require("http-status-codes");

//a function to get answer for a question
async function getAnswer(req, res) {
  const { question_id } = req.params; // Extracting the question ID from the request parameters
  try {
    // Query to check if the question exists
    const [question] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid =?",
      [question_id]
    );

    // Check if the question was found
    if (question.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The requested question could not be found." });
    }

    // Query to get answers associated with the question
    const [answers] = await dbConnection.query(
      "SELECT * FROM answers WHERE questionid = ?",
      [question_id]
    );

    // Respond with the list of answers
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Here are the answers", answers });
  } catch (error) {
    console.log(error); // Log the error message
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}

//a function to post or submit answer for a question
async function submitAnswer(req, res) {
  const { questionid, answer } = req.body; // Destructuring the request body to get question ID and answer
  // Validate that both question ID and answer are provided
  if (!questionid || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const userid = req.user.userid; // Get the user ID from the request object

    // Insert the new answer into the database
    await dbConnection.query(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?,?,?)",
      [questionid, userid, answer]
    );

    // Respond with a success message
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.log(error); // Log the error message
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}

module.exports = { getAnswer, submitAnswer };
