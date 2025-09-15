const express = require("express");

const router = express.Router();
const { db } = require("../util/database");
const leftJoinQuery =
  "SELECT sets.set_id AS setId, title, description,  COUNT(*) AS numCards FROM sets LEFT JOIN cards ON cards.set_id = sets.set_id GROUP BY sets.set_id";

// =======================================================

router.get("/", (req, res) => {
  db.execute(leftJoinQuery).then(([sets]) => {
    res.status(200).json({ sets: sets });
  });
});

// =======================================================

router.post("/add", (req, res) => {
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
    .then(() => {
      res.status(200).json({ message: "Added Successfully" });
    })
    .catch((err) => console.log(err));
});

// =======================================================

router.put("/update", async (req, res) => {
  const {
    setId,
    updatedSet: { title, description, cards },
  } = req.body;

  try {
    const [r] = await db.execute("DELETE FROM cards WHERE set_id=?", [setId]);

    const [result] = await db.execute(
      "UPDATE sets SET title = ?, description = ? WHERE set_id = ?",
      [title, description, setId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Set Not Found" });
    }

    const newCards = cards.map((card) => [setId, card.term, card.definition]);

    await db.query("INSERT INTO cards (set_id, term, definition) VALUES ?", [
      newCards,
    ]);

    res.status(200).json({ message: "Set Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Update Failed",
    });
  }
});

// =======================================================

router.delete("/:id", (req, res) => {
  const setId = req.params.id;
  db.execute("DELETE FROM sets WHERE set_id=?", [setId]).then(() =>
    db.execute(leftJoinQuery).then(([sets]) => {
      res.status(200).json({ sets: sets });
    })
  );
});

// =======================================================

router.get("/:id", (req, res) => {
  const setId = req.params.id;

  db.execute(
    "SELECT title, description, set_id AS setId FROM sets WHERE set_id=?",
    [setId]
  ).then(([set]) => {
    console.log(set);
    res.status(200).json(set);
  });
});

module.exports = router;
