import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const port = 8080;
export const API_URL =
  process.env.REACT_APP_API_URL || `http://localhost:${port}`;
const SECRET_KEY = process.env.SECRET_KEY;
const SALT_ROUNDS = 10;

const { Pool } = pg;
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token provided");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token error:", err);
    res.status(401).send("Invalid or expired token");
  }
};

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

    // Generujemy token na podstawie danych logowania
    const token = jwt.sign({ username, id: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.send({ token });
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

    console.log("New note added successfully!");
    res.status(201).json(result.rows[0]);
    // return res.status(201).send("Adding new note was successful.");
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
      return res.status(404).send("Note not found or you don't have permission to edit it");
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
      return res.status(404).send("Note not found or you don't have permission to delete it");
    }

    res.status(200).json({ message: "Note deleted", deletedNote: result.rows[0] });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send("Internal Server Error");
  }
});


// app.get("/users", (req, res) => {
//   res.send(req.db.users);
// });

// const authenticateUser = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).send("Access denied. No token provided.");
//   }
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).send("Token expired. Please log in again.");
//     }
//     console.log("Invalid token.");
//     res.status(400).send("Invalid token.");
//   }
// };

app.post("/logout", (req, res) => {
  console.log("User logged out successfully.");
  res.status(200).send({ message: "User logged out successfully." });
});

app.listen(port, () => console.log(`API is running on ${API_URL}`));
