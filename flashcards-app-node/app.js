const path = require("path");

const express = require("express");
const db = require("./util/database");
const bodyParser = require("body-parser");
const { assert } = require("console");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(path.join(__dirname, "public/browser")));

const leftJoinQuery =
  "SELECT sets.set_id AS setId, title, description,  COUNT(*) AS numCards FROM sets LEFT JOIN cards ON cards.set_id = sets.set_id GROUP BY sets.set_id";

app.get("/sets", (req, res) => {
  db.execute(leftJoinQuery).then(([sets]) => {
    console.log(sets);
    res.status(200).json({ sets: sets });
  });
});

app.post("/set", (req, res) => {
  const newSet = { title: req.body.title, description: req.body.description };
  const newCards = req.body.cards;
  db.execute("INSERT INTO sets (title, description) VALUES (?,?)", [
    newSet.title,
    newSet.description,
  ])
    .then(([res]) => {
      const cards = newCards.map((card) => [
        card.term,
        card.definition,
        res.insertId,
      ]);
      return db.query("INSERT INTO cards (term, definition, set_id) VALUES ?", [
        cards,
      ]);
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

app.get("/cards/:setId", (req, res) => {
  const setId = req.params.setId;
  console.log(setId);
  db.execute(
    "SELECT id, term, definition, set_id AS setId  FROM cards WHERE set_id=?",
    [setId]
  ).then(([cards]) => {
    res.status(200).json({ cards: cards });
  });
});

app.get("/sets/:setId", (req, res) => {
  const setId = req.params.setId;

  db.execute(
    "SELECT title, description, set_id AS setId FROM sets WHERE set_id=?",
    [setId]
  ).then(([set]) => {
    res.status(200).json(set);
  });
});

app.delete("/sets/:id", (req, res) => {
  const setId = req.params.id;
  db.execute("DELETE FROM sets WHERE set_id=?", [setId]).then(() =>
    db.execute(leftJoinQuery).then(([sets]) => {
      res.status(200).json({ sets: sets });
    })
  );
});

app.patch("/cards", async (req, res) => {
  const { id, term, definition } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE cards SET term = ?, definition = ? WHERE id = ?",
      [term, definition, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({ message: "Card updated successfully" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "update failed" });
  }
});

app.listen(3000);
