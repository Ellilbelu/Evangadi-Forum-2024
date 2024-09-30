// database connnection
const dbConnection = require("../Database/dbConfig");

async function authentication(req, res) {
  res.send(" Checks the current authenticated user's information");
}

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(400)
      .json({ msg: "please provide the information for all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid from users WHERE username = ? or email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res.status(400).json({ msg: "the user already registered" });
    }

    if (password.length <= 8) {
      return res
        .status(400)
        .json({ msg: "password must be at least eight characters" });
    }

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email,password) VALUES(?,?,?,?,?)",
      [username, firstname, lastname, email, password]
    );
    return res.status(201).json({ msg: "user created" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "something went wrong, try again later!" });
  }
}

async function login(req, res) {
  res.send("user login successful");
}

module.exports = { authentication, register, login };
