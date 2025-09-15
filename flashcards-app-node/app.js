const path = require("path");

const express = require("express");
const { db, initDB } = require("./util/database");
const bodyParser = require("body-parser");
const setsRouter = require("./routes/sets");
const cardsRouter = require("./routes/cards");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, DELETE, PATCH, POST"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.use(express.static(path.join(__dirname, "public/browser")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/sets", setsRouter);

app.use("/cards", cardsRouter);

initDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started successfully");
    });
  })
  .catch((err) => {
    console.log("could not start server", err);
  });
