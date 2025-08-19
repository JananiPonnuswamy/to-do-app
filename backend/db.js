import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // 👈 change if your MySQL user is different
  password: "Begam@1216",  // 👈 put your MySQL Workbench password here
  database: "todo_db"        // 👈 we will create this database
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

export default db;
