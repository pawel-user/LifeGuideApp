import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 8080;
export const API_URL = process.env.REACT_APP_API_URL || `http://localhost:${port}`;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "db.json");

let usersData = null;
let notesData = null;

const readFile = async (req, res, next) => {
  try {
    const data = await fs.promises.readFile(dbPath, "utf8");
    const parsedData = data ? JSON.parse(data) : { users: [], notes: [] };
    usersData = parsedData.users;
    notesData = parsedData.notes;
  } catch (error) {
    console.log("Error reading db.json:", error);
  }
  next();
};

const setUsersData = (req, res, next) => {
  if (usersData !== null) {
    req.db = { users: usersData, notes: notesData };
  } else {
    req.db = { users: [], notes: [] };
  }
  next();
};

app.use(readFile);
app.use(setUsersData);

app.get("/users", (req, res) => {
  res.send(req.db.users);
});

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token expired. Please log in again.");
    }
    console.log("Invalid token.");
    res.status(400).send("Invalid token.");
  }
};

app.get("/user/notes", authenticateUser, (req, res) => {
  const userNotes = req.db.notes.filter((note) => note.userId === req.user.id);
  res.send(userNotes);
});

app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const user = usersData.find(
      (userItem) =>
        userItem.username === username && userItem.password === password
    );
    if (user) {
      const token = jwt.sign(
        { username: user.username, id: user.id },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.send({ token });
    } else if (usersData === null) {
      console.log("No saved users in the database");
      res.status(400).json({ error: "No saved users in the database." });
    } else {
      console.log("Invalid credentials");
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in /login route:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/register", (req, res) => {
  try {
    const uploadedUser = req.body;

    if (
      !uploadedUser.username ||
      !uploadedUser.email ||
      !uploadedUser.password
    ) {
      console.log("Empty fields detected!");
      return res.status(400).send("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(uploadedUser.email)) {
      return res.status(400).send("Invalid email format");
    }

    const userExists = req.db.users.find(
      (userItem) =>
        userItem.username === uploadedUser.username ||
        userItem.email === uploadedUser.email
    );

    if (userExists) {
      console.log("The user with this data already exists!");
      return res.status(409).send("User already exists");
    } else if (uploadedUser.password !== uploadedUser.repeatedPassword) {
      console.log("The user credentials are not the same!");
      return res.status(400).send("User credentials failed");
    }

    const newId =
      req.db.users.length > 0
        ? req.db.users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1
        : 1;

    const token = jwt.sign(
      { username: uploadedUser.username, id: newId },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const newUser = {
      id: newId,
      username: uploadedUser.username,
      email: uploadedUser.email,
      password: uploadedUser.password,
      token,
    };
    req.db.users.push(newUser);

    fs.writeFile(
      dbPath,
      JSON.stringify({ users: req.db.users, notes: req.db.notes }, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to db.json:", err);
          return res.status(500).send("Internal Server Error");
        } else {
          console.log("New user added successfully!");
          app.use(setUsersData);
          return res.status(201).send("User registered successfully");
        }
      }
    );
  } catch (error) {
    console.error("Error in /register route:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/add/note", authenticateUser, (req, res) => {
  try {
    const uploadedNote = req.body;

    // const userNotes = req.db.notes.filter(
    //   (note) => note.userId === req.user.id
    // );

    // const noteUrlExists = userNotes.find(
    //   (noteItem) => noteItem.url === uploadedNote.url
    // );

    // if (noteUrlExists) {
    //   return res
    //     .status(400)
    //     .json({ message: "Note with the website URL already exists" });
    // }

    const newId =
      req.db.notes.length > 0
        ? req.db.notes.reduce((maxId, note) => Math.max(maxId, note.id), 0) + 1
        : 1;

    const newNote = {
      id: newId,
      userId: req.user.id,
      noteTitle: uploadedNote.noteTitle,
      description: uploadedNote.description,
    };
    req.db.notes.push(newNote);

    fs.writeFile(
      dbPath,
      JSON.stringify({ users: req.db.users, notes: req.db.notes }, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to db.json:", err);
          return res.status(500).send("Internal Server Error");
        } else {
          console.log("New note added successfully!");
          return res.status(201).send("Adding new note was successful.");
        }
      }
    );
  } catch (error) {
    console.error("Error in /add/note route:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.patch("/notes/:id", authenticateUser, (req, res) => {
  const noteId = parseInt(req.params.id);
  const noteIndex = notesData.findIndex((note) => note.id === noteId);

  if (noteIndex === -1) {
    return res.status(404).send("Note not found.");
  }

  if (req.body.noteTitle) notesData[noteIndex].noteTitle = req.body.noteTitle;
  if (req.body.description)
    notesData[noteIndex].description = req.body.description;

  const updatedData = {
    users: usersData,
    notes: notesData,
  };

  fs.writeFile(dbPath, JSON.stringify(updatedData, null, 2), (err) => {
    if (err) {
      console.error("Error writing to db.json:", err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("Data successfully written to db.json");
    setTimeout(() => {
      res.json(notesData[noteIndex]);
    }, 100);
  });
});

app.delete("/notes/:id", authenticateUser, (req, res) => {
  const noteIndex = notesData.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );
  if (noteIndex === -1)
    return res.status(404).json({ message: "Note not found" });

  notesData.splice(noteIndex, 1);

  const updatedData = {
    users: usersData,
    notes: notesData,
  };

  fs.writeFile(dbPath, JSON.stringify(updatedData, null, 2), (err) => {
    if (err) {
      console.error("Error writing to db.json:", err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("Data successfully written to db.json");
    setTimeout(() => {
      res.json({ message: "Post deleted" });
    }, 100);
  });
});

app.post("/logout", (req, res) => {
  console.log("User logged out successfully.");
  res.status(200).send({ message: "User logged out successfully." });
});

app.listen(port, () => console.log(`API is running on ${API_URL}`));
