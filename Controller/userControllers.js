// database connnection
const dbConnection = require("../Database/dbConfig");

//importing the password encrypting module
const bcrypt = require("bcrypt");

//importing status codes
const { StatusCodes } = require("http-status-codes");

// importing json web token
const jwt = require("jsonwebtoken");

// ************afunction to register new user**************
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide the information for all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid from users WHERE username = ? or email = ?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "the user already registered" });
    }

    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least eight characters" });
    }
    //for encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email,password) VALUES(?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "user created successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
}

// a function to login a user

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required fields!" });
  }

  try {
    // Query to find the user by email
    const [user] = await dbConnection.query(
      "select username,userid,password FROM users WHERE email = ?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "60d",
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "user login successful", token: token, });

    // return res.json({user:user[0].password})
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

//a function to authenticate a user
async function authentication(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  res.status(StatusCodes.OK).json({ msg: "valid user", username, userid });
}

module.exports = { authentication, register, login };
