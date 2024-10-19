const { StatusCodes } = require("http-status-codes"); // Importing HTTP status codes
const jwt = require("jsonwebtoken"); // Importing JSON Web Token library

// Middleware function for authentication
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // Extract the authorization header from the request

  // Check if the authorization header is present and in the correct format
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("Authorization header missing or invalid format.");
    // Respond with an unauthorized status if the header is invalid
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authentication invalid" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  try {
    // Verify the token and extract the user details
    const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user details to the request object for use in later middleware or route handlers
    req.user = { username, userid };
    next(); // Call the next middleware function
  } catch (error) {
    console.log("Token verification failed:", error);
    // Respond with an unauthorized status if token verification fails
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authentication invalid" });
  }
}

// Exporting the authentication middleware for use in other parts of the application
module.exports = authMiddleware;
