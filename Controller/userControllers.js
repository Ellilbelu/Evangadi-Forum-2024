const dbConnection = require("../Database/dbConfig"); // Import database connection
const { StatusCodes } = require("http-status-codes"); // Import HTTP status codes
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jwt for token generation

//--------------------------------------- Register Function ------------------------------------------
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body; // Destructure request body
  // Validate required fields
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST) // Return bad request status
      .json({ msg: "Please provide all required fields" }); // Response message
  }
  try {
    // Check if username or email already exists in the database
    const [user] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? or email = ?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.CONFLICT) // Return conflict status if user exists
        .json({ msg: "You have already registered" });
    }
    // Validate password length
    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST) // Return bad request status
        .json({ msg: "Password must be greater than 8 characters" });
    }
    // Password encryption
    const salt = await bcrypt.genSalt(10); // Generate salt to get a random value
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Insert new user into the database
    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User created successfully" }); // Success response
  } catch (error) {
    console.log(error.message); // Log error for debugging
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR) // Return internal server error
      .json({ msg: "Something went wrong, Try again later" }); // Response message
  }
}

//--------------------------------------- Log in Function ------------------------------------------
async function login(req, res) {
  const { email, password } = req.body; // Destructure request body
  // Validate required fields
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST) // Return bad request status
      .json({ msg: "Please provide all required fields" }); // Response message
  }
  try {
    // Retrieve user by email from the database
    const [user] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User not found" }); // User not found
    }
    // Comparing password with the hashed password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid Password" }); // Invalid password
    }

    // Generating token
    const username = user[0].username; // Extract username
    const userid = user[0].userid; // Extract user ID
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    }); // Create JWT token
    return res.status(StatusCodes.OK).json({
      msg: "Logged in successfully",
      token: token,
      username: username,
    }); // Success response with token
  } catch (error) {
    console.log(error.message); // Log error for debugging
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR) // Return internal server error
      .json({ msg: "Something went wrong, Try again later" }); // Response message
  }
}

//--------------------------------------- Check user Function ------------------------------------------
async function checkUser(req, res) {
  const username = req.user.username; // Extract username from request
  const userid = req.user.userid; // Extract user ID from request
  res.status(StatusCodes.OK).json({ msg: "Valid User", username, userid }); // Response with user info
}

module.exports = { register, login, checkUser }; // Export functions
