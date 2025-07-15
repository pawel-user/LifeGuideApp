import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";
import { authenticateUser } from "../server/middleware/authenticate.js";

dotenv.config();

const app = express();
const port = 8080;
const API_URL = process.env.REACT_APP_API_URL || `http://localhost:${port}`;
const SECRET_KEY = process.env.SECRET_KEY;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);

const { Pool } = pg;
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, email, password, repeatedPassword } = req.body;

  if (!username || !email || !password || !repeatedPassword) {
    return res.status(400).send("All fields are required");
  }

  if (password !== repeatedPassword) {
    return res.status(400).send("Passwords do not match");
  }

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hashedPassword]
    );

    const token = jwt.sign({ username, id: result.rows[0].id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).send({ token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).send("User not found.");
    }

    const user = userQuery.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send("Invalid credentials.");
    }

    const token = jwt.sign({ username, id: user.id }, SECRET_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "7d",
    });

    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    res.send({ token, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/user/notes", authenticateUser, async (req, res) => {
  try {
    const userNotes = await pool.query(
      "SELECT * FROM notes WHERE userID = $1",
      [req.user.id]
    );
    res.send(userNotes.rows);
  } catch (error) {
    console.error("Error during loading user notes:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add/notes", authenticateUser, async (req, res) => {
  const { noteTitle, description } = req.body;
  const userID = req.user.id;

  if (!noteTitle || !description) {
    return res.status(400).send("All fields are required");
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (userid, notetitle, description) VALUES ($1, $2, $3) RETURNING id",
      [userID, noteTitle, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error during adding new user note:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.patch("/notes/:id", authenticateUser, async (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const { noteTitle, description } = req.body;
  const userId = req.user.id;

  if (!noteTitle || !description) {
    return res.status(400).send("All fields are required");
  }

  try {
    const result = await pool.query(
      `UPDATE notes
       SET notetitle = $1, description = $2
       WHERE id = $3 AND userid = $4
       RETURNING *`,
      [noteTitle, description, noteId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .send("Note not found or you don't have permission to edit it");
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/notes/:id", authenticateUser, async (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM notes
       WHERE id = $1 AND userid = $2
       RETURNING *`,
      [noteId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .send("Note not found or you don't have permission to delete it");
    }

    res
      .status(200)
      .json({ message: "Note deleted", deletedNote: result.rows[0] });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).send("No token provided");

  try {
    const decoded = jwt.verify(refreshToken, SECRET_KEY);
    const userId = decoded.id;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND refresh_token = $2",
      [userId, refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(403).send("Invalid refresh token");
    }

    const token = jwt.sign(
      { username: result.rows[0].username, id: userId },
      SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.send({ token });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).send("Invalid or expired refresh token");
  }
});

app.post("/logout", authenticateUser, async (req, res) => {
  try {
    await pool.query("UPDATE users SET refresh_token = NULL WHERE id = $1", [req.user.id]);
    res.status(200).send({ message: "User logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => console.log(`API is running on ${API_URL}`));
