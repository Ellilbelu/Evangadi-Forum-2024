function allQuestions(req, res) {
  res.send(" the questions are ...");
}

function singleQuestion(req, res) {
  res.send("Retrieves details of a specific question.");
}

function submitQuestion(req, res) {
  res.send("Question created successfully");
}

module.exports = { allQuestions, singleQuestion, submitQuestion };
