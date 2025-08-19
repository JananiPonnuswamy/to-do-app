const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all tasks
router.get("/", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Create task
router.post("/", (req, res) => {
  const { title, description } = req.body;
  db.query(
    "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
    [title, description, false],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, title, description, completed: 0 });
    }
  );
});

// Update (mark completed)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE tasks SET completed = ? WHERE id = ?", [true, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Task marked as completed" });
  });
});

// Delete task
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Task deleted" });
  });
});

module.exports = router;

