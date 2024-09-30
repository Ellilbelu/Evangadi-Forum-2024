function getAnswer(req, res) {
  res.send("the answers for the question are ....");
}

function submitAnswer(req, res) {
  res.send("answer submmited /posted/ successfully");
}

module.exports = { getAnswer, submitAnswer };
