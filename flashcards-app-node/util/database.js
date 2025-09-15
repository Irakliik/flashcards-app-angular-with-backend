const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Irakliko20",
});

// module.exports = pool.promise();

const db = pool.promise();

async function initDB() {
  try {
    await db.query("CREATE DATABASE IF NOT EXISTS flashcards_app");

    await db.query("USE flashcards_app");

    // =========================================================================

    const initialSets = [
      ["italian-english", "animals", 1],
      ["italian english vocabulary", "fruit", 2],
      ["german english vocabulary", "vegetables", 3],
    ];

    await db
      .query(
        `CREATE TABLE IF NOT EXISTS sets
    (
    set_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
    
    )`
      )
      .then(() => db.query("SELECT COUNT(*) AS count FROM sets"))
      .then(([rows]) => {
        if (rows[0].count === 0) {
          db.query(`INSERT INTO sets (title, description, set_id) VALUES ?`, [
            initialSets,
          ]);
        }
      });

    // =============================================================================

    const initialCards = [
      ["cane", "dog", 1],
      ["gatto", "cat", 1],
      ["pecora", "sheep", 1],
      ["mela", "apple", 2],
      ["uva", "grape", 2],
      ["fragola", "strawberry", 2],
      ["arancia", "orange", 2],
      ["die Gurke", "cucumber", 3],
      ["die Kartoffel", "potato", 3],
      ["die Zwiebel", "onion", 3],
      ["die Möhre", "carrot", 3],
      ["der Spinat", "spinach", 3],
    ];

    // await db.query("USE flashcards_app");
    await db.query(
      `CREATE TABLE IF NOT EXISTS cards (
          id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
          term VARCHAR(300),
          definition VARCHAR(300),
          set_id INT,
          FOREIGN KEY (set_id) REFERENCES sets(set_id) ON DELETE CASCADE
              );`
    );

    const [rows] = await db.query("SELECT COUNT(*) AS count FROM cards");

    if (rows[0].count === 0) {
      console.log(12);
      await db.query("INSERT INTO cards (term, definition, set_id) VALUES ?", [
        initialCards,
      ]);
    }

    console.log("Database and tables ready");
  } catch (err) {
    console.error("❌ Error initializing DB:", err);
    throw err;
  }
}

module.exports = { db, initDB };
