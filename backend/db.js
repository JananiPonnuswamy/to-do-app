const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // change if different
  password: "your_password", // set your MySQL password
  database: "todo_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});

module.exports = db;

