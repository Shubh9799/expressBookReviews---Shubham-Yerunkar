const express = require('express');
let books = require("./booksdb.js");  // Import the books database
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Get list of books available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json(books);  // Return the books array from booksdb.js
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
    const book = books.find(b => b.isbn === isbn);  // Find book by ISBN
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;
    const booksByAuthor = books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));  // Filter books by author
    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: 'No books found by this author' });
    }
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;
    const booksByTitle = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));  // Filter books by title
    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: 'No books found with this title' });
    }
});

// Task 5: Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const book = books.find(b => b.isbn === isbn);  // Find book by ISBN
    if (book) {
        res.status(200).json(book.reviews);  // Assuming reviews are stored under `reviews` in each book
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Task 6: Register new users (registration functionality)
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const newUser = { username, password };
        users.push(newUser);  // Add new user to the users array
        res.status(201).json({ message: "User registered successfully!" });
    } else {
        res.status(400).json({ message: "Username and password are required" });
    }
});

// Task 7: Login user
public_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);  // Find user by credentials
    if (user) {
        const token = "dummyToken";  // Replace with real JWT token generation logic
        res.status(200).json({ message: "Login successful", token });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

// Task 8: Add or modify book reviews
public_users.post('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const { username, review } = req.body;
    const book = books.find(b => b.isbn === isbn);  // Find book by ISBN
    if (book) {
        let existingReview = book.reviews.find(r => r.username === username);
        if (existingReview) {
            existingReview.review = review;  // Modify existing review
            res.status(200).json({ message: "Review updated successfully!" });
        } else {
            book.reviews.push({ username, review });  // Add new review
            res.status(200).json({ message: "Review added successfully!" });
        }
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Task 9: Delete book review
public_users.delete('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const { username } = req.body;
    const book = books.find(b => b.isbn === isbn);  // Find book by ISBN
    if (book) {
        const reviewIndex = book.reviews.findIndex(r => r.username === username);  // Find review by username
        if (reviewIndex !== -1) {
            book.reviews.splice(reviewIndex, 1);  // Delete the review
            res.status(200).json({ message: "Review deleted successfully!" });
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Task 10: Get list of books (Already covered by Task 1)
public_users.get('/books', function (req, res) {
    res.status(200).json(books);  // Return the books array from booksdb.js
});

// Task 11: Get book details based on ISBN (using Promise/Async-Await)
public_users.get('/isbn/:isbn/details', async function (req, res) {
    const { isbn } = req.params;
    try {
        const book = books.find(b => b.isbn === isbn);  // Find book by ISBN
        if (book) {
            res.status(200).json(book);  // Return book details
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Task 12: Get books by Author (using Promise/Async-Await)
public_users.get('/author/:author/details', async function (req, res) {
    const { author } = req.params;
    try {
        const booksByAuthor = books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));  // Filter books by author
        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);  // Return books by author
        } else {
            res.status(404).json({ message: 'No books found by this author' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Task 13: Get books by Title (using Promise/Async-Await)
public_users.get('/title/:title/details', async function (req, res) {
    const { title } = req.params;
    try {
        const booksByTitle = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));  // Filter books by title
        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle);  // Return books by title
        } else {
            res.status(404).json({ message: 'No books found with this title' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports.general = public_users;
