const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: "evangadi-admin",
  database: "evangadi_forum",
  host: "localhost",
  password: "evangadi123forum",
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
