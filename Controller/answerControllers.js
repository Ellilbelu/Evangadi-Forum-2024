const dbConnection = require("../Database/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAnswer(req, res) {
  const { question_id } = req.params;

  try {
    const [question] = await dbConnection.query(
      "SELECT * FROM questions WHERE questionid =?",
      [question_id]
    );
    if (question.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The requested question could not be found." });
    }

    const [answers] = await dbConnection.query(
      "SELECT * FROM answers WHERE questionid = ?",
      [question_id]
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Here are the answers", answers });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: " An unexpected error occurred" });
  }
}

async function submitAnswer(req, res) {
  const { questionid, answer } = req.body;
  if (!questionid || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  if (answer.length == 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No answers found for the requested question" });
  }
  try {
    const userid = req.user.userid;
    await dbConnection.query(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?,?,?)",
      [questionid, userid, answer]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "You submitted an answer successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: " Something went wrong, try again later!" });
  }
}
module.exports = { getAnswer, submitAnswer };
