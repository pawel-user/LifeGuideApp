// middleware/authenticate.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("No token provided");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    if (process.env.NODE_ENV === "development") {
      console.log("Authorized user ID:", decoded.id);
    }

    next();
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(401).send("Invalid or expired token");
  }
};
