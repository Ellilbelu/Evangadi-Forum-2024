require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 2121;

const cors = require("cors");
app.use(cors());

// database connnection
const dbConnection = require("./Database/dbConfig.js");

//json middleware to extract json data
app.use(express.json());

//user route middleware file
const userRoutes = require("./Route/userRoute.js");
//user middleware
app.use("/api/users", userRoutes);

// answer route middleware file
const answerRoutes = require("./Route/answerRoute");
// answer middleware
app.use("/api/answer", answerRoutes);

// question route middleware file
const questionRoutes = require("./Route/questionRoute.js");

// question middleware
app.use("/api/question", questionRoutes);

//tag route middleware file
const tagRoutes = require("./Route/tagRoute");

//tag middleware
app.use("/api/questions", tagRoutes);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test'");
    await app.listen(PORT);
    console.log("Database connection established");
    console.log(`Listening on ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
