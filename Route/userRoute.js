//import express and route module
const express = require("express");
const router = express.Router();

//user controllers
const {
  authentication,
  register,
  login,
} = require("../Controller/userControllers");

// authentication route
router.get("/checkUser", authentication);

//Signup or registration route
router.post("/register", register);

//Login route
router.post("/login", login);

module.exports = router;
