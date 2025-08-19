import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all tasks
router.get("/", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a task
router.post("/", (req, res) => {
  const { title } = req.body;
  db.query("INSERT INTO tasks (title) VALUES (?)", [title], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, title });
  });
});

// Delete a task
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], err => {
    if (err) return res.status(500).send(err);
    res.json({ success: true });
  });
});

export default router;
