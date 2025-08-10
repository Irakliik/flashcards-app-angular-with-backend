const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "flashcards-app",
  password: "Irakliko20",
});

module.exports = pool.promise();
