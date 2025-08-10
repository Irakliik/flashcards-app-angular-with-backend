const path = require("path");

const express = require("express");
const db = require("./util/database");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(path.join(__dirname, "public/browser")));

app.get("/sets", (req, res) => {
  console.log(12);
  db.execute("SELECT * FROM sets").then(([sets]) => {
    res.status(200).json({ sets: sets });
  });
});

console.log(__dirname);

app.listen(3000);
