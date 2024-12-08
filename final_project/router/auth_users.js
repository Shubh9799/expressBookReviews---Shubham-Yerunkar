const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const regd_users = express.Router();
let books = require("./booksdb.js");

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user !== undefined;
};

// User login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
  req.session.token = token;

  return res.status(200).json({
    message: "Login successful",
    token,
  });
});

// Add/Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  if (!req.session.token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const decoded = jwt.verify(req.session.token, "secret_key");
  const username = decoded.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for book with ISBN ${isbn} added/modified successfully.`,
    reviews: books[isbn].reviews,
  });
});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  if (!req.session.token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const decoded = jwt.verify(req.session.token, "secret_key");
  const username = decoded.username;

  if (!books[isbn] || !books[isbn].reviews) {
    return res.status(404).json({ message: "Book or review not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(403).json({
      message: "You can only delete your own reviews",
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for book with ISBN ${isbn} deleted successfully.`,
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
