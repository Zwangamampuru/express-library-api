// index.js
import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Async server start
const startServer = async () => {
  try {
    await pool.connect();
    console.log("✅ PostgreSQL connected");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();

// Test route
app.get("/", (req, res) => {
  res.send("📚 Library API is running!");
});

// ----- Books Routes -----

// Get all books
app.get("/books", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Book not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new book
app.post("/books", async (req, res) => {
  try {
    const { title, author_id, genres, published_year, available } = req.body;
    const result = await pool.query(
      `INSERT INTO books (title, author_id, genres, published_year, available)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, author_id, genres, published_year, available]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book availability
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    const result = await pool.query(
      "UPDATE books SET available=$1 WHERE id=$2 RETURNING *",
      [available, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Book not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM books WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted", book: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
