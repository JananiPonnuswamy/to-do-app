import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ---- MySQL connection ----
const db = mysql.createConnection({
  host: "localhost",
  user: "root",            // change if needed
  password: "Begam@1216", // change if needed
  database: "todo_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// Ensure table exists and 'completed' is a tinyint
db.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// ---- Routes ----

// Get all
app.get("/tasks", (req, res) => {
  db.query("SELECT id, title, description, completed FROM tasks ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch tasks" });
    // Normalize MySQL tinyint to boolean for frontend
    const out = rows.map((r) => ({ ...r, completed: !!r.completed }));
    res.json(out);
  });
});

// Create
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  db.query(
    "INSERT INTO tasks (title, description) VALUES (?, ?)",
    [title.trim(), description || ""],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add task" });
      res.json({
        id: result.insertId,
        title: title.trim(),
        description: description || "",
        completed: false,
      });
    }
  );
});

// Update title/description
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  db.query(
    "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
    [title || "", description || "", id],
    (err) => {
      if (err) return res.status(500).json({ error: "Failed to update task" });
      res.json({ id: Number(id), title, description });
    }
  );
});

// ✅ Mark complete / undo complete
app.put("/tasks/:id/complete", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body; // expected boolean
  const val = completed ? 1 : 0;  // store as tinyint 1/0

  db.query(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [val, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Failed to toggle task" });
      res.json({ id: Number(id), completed: !!completed });
    }
  );
});

// Delete
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete task" });
    res.json({ message: "Task deleted", id: Number(id) });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
