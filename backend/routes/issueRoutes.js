const express = require("express");

const {
  getIssues,
  issueBook,
  returnBook
} = require("../controllers/issueController");

const router = express.Router();

// Get all issued/returned books
router.get("/", getIssues);

// Issue a book
router.post("/", issueBook);

// Return a book
router.put("/:id/return", returnBook);

module.exports = router;