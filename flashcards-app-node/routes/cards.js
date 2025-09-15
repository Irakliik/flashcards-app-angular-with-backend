const express = require("express");

const router = express.Router();
const { db } = require("../util/database");

// =======================================================
// =======================================================

router.patch("/", async (req, res) => {
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

// =======================================================
// =======================================================

router.get("/:setId", (req, res) => {
  const setId = req.params.setId;
  db.execute(
    "SELECT id, term, definition, set_id AS setId  FROM cards WHERE set_id=?",
    [setId]
  ).then(([cards]) => {
    res.status(200).json({ cards: cards });
  });
});

module.exports = router;
