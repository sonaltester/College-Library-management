const express = require("express");

const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookCount,
  getBookQuantity
} = require("../controllers/bookController");

const router = express.Router();


// ==========================================
// BOOK MANAGEMENT ROUTES
// ==========================================

// GET all books
router.get("/", getBooks);

// GET total number of book titles
router.get("/count", getBookCount);

// GET total and available copies
router.get("/quantity", getBookQuantity);

// CREATE new book
router.post("/", createBook);

// UPDATE existing book
router.put("/:id", updateBook);

// DELETE book
router.delete("/:id", deleteBook);


module.exports = router;