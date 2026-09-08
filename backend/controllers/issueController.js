const Issue = require("../models/Issue");
const Book = require("../models/Book");
const Student = require("../models/Student");

// ========================================
// GET ALL ISSUES
// ========================================

const getIssues = async (req, res) => {
  try {

    const issues = await Issue.find()
      .populate(
        "book",
        "bookId isbn title author subject publisher shelfNumber"
      )
      .populate(
        "student",
        "name enrollmentNo email course semester phone status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(issues);

  } catch (error) {

    console.error("GET ISSUES ERROR:", error);

    res.status(500).json({
      message: error.message || "Failed to fetch issues"
    });
  }
};

// ========================================
// ISSUE BOOK
// ========================================

const issueBook = async (req, res) => {
  try {

    const {
      book,
      student,
      issueDate,
      dueDate
    } = req.body;

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!book || !student) {
      return res.status(400).json({
        message: "Book and student are required"
      });
    }

    if (!issueDate) {
      return res.status(400).json({
        message: "Issue date is required"
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        message: "Due date is required"
      });
    }

    // -------------------------
    // FIND BOOK
    // -------------------------

    const bookData = await Book.findById(book);

    if (!bookData) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // -------------------------
    // CHECK AVAILABLE
    // -------------------------

    if (Number(bookData.availableQuantity) <= 0) {
      return res.status(400).json({
        message: "Book is not available"
      });
    }

    // -------------------------
    // FIND STUDENT
    // -------------------------

    const studentData =
      await Student.findById(student);

    if (!studentData) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // -------------------------
    // CHECK ACTIVE
    // -------------------------

    if (studentData.status === "Inactive") {
      return res.status(400).json({
        message: "Inactive student cannot issue a book"
      });
    }

    // -------------------------
    // CHECK DUPLICATE ACTIVE ISSUE
    // -------------------------

    const existingIssue =
      await Issue.findOne({
        book,
        student,
        status: "Issued"
      });

    if (existingIssue) {
      return res.status(400).json({
        message:
          "This student already has this book issued"
      });
    }

    // -------------------------
    // DATE VALIDATION
    // -------------------------

    const finalIssueDate =
      new Date(`${issueDate}T00:00:00`);

    const finalDueDate =
      new Date(`${dueDate}T23:59:59`);

    if (isNaN(finalIssueDate.getTime())) {
      return res.status(400).json({
        message: "Invalid issue date"
      });
    }

    if (isNaN(finalDueDate.getTime())) {
      return res.status(400).json({
        message: "Invalid due date"
      });
    }

    if (finalDueDate < finalIssueDate) {
      return res.status(400).json({
        message:
          "Due date cannot be before issue date"
      });
    }

    // -------------------------
    // CREATE ISSUE
    // -------------------------

    const issue = await Issue.create({

      book: bookData._id,

      student: studentData._id,

      issueDate: finalIssueDate,

      dueDate: finalDueDate,

      status: "Issued",

      fine: 0

    });

    // -------------------------
    // DECREASE AVAILABLE
    // -------------------------

    bookData.availableQuantity =
      Number(bookData.availableQuantity) - 1;

    await bookData.save();

    // -------------------------
    // RESPONSE
    // -------------------------

    const populatedIssue =
      await Issue.findById(issue._id)
        .populate(
          "book",
          "bookId isbn title author subject"
        )
        .populate(
          "student",
          "name enrollmentNo email"
        );

    res.status(201).json({
      message: "Book issued successfully",
      issue: populatedIssue
    });

  } catch (error) {

    console.error("ISSUE BOOK ERROR:", error);

    res.status(500).json({
      message:
        error.message || "Failed to issue book"
    });
  }
};

// ========================================
// RETURN BOOK
// ========================================

const returnBook = async (req, res) => {

  try {

    const issue =
      await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found"
      });
    }

    // -------------------------
    // ALREADY RETURNED
    // -------------------------

    if (issue.status === "Returned") {
      return res.status(400).json({
        message: "Book has already been returned"
      });
    }

    // -------------------------
    // RETURN DATE = TODAY
    // -------------------------

    const returnDate = new Date();

    // -------------------------
    // DUE DATE
    // -------------------------

    const dueDate =
      new Date(issue.dueDate);

    dueDate.setHours(0, 0, 0, 0);

    const returnDateOnly =
      new Date(returnDate);

    returnDateOnly.setHours(0, 0, 0, 0);

    // -------------------------
    // CALCULATE LATE DAYS
    // -------------------------

    let lateDays = 0;

    if (returnDateOnly > dueDate) {

      const difference =
        returnDateOnly.getTime() -
        dueDate.getTime();

      lateDays = Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
      );
    }

    // -------------------------
    // FINE ₹5 PER DAY
    // -------------------------

    const FINE_PER_DAY = 5;

    const fine =
      lateDays * FINE_PER_DAY;

    // -------------------------
    // UPDATE ISSUE
    // -------------------------

    issue.returnDate = returnDate;

    issue.lateDays = lateDays;

    issue.fine = fine;

    issue.status = "Returned";

    await issue.save();

    // -------------------------
    // INCREASE AVAILABLE
    // -------------------------

    const book =
      await Book.findById(issue.book);

    if (book) {

      book.availableQuantity =
        Number(book.availableQuantity) + 1;

      // Safety: available cannot exceed total
      if (
        book.availableQuantity >
        Number(book.quantity)
      ) {
        book.availableQuantity =
          Number(book.quantity);
      }

      await book.save();
    }

    // -------------------------
    // RESPONSE
    // -------------------------

    const populatedIssue =
      await Issue.findById(issue._id)
        .populate(
          "book",
          "bookId isbn title author subject"
        )
        .populate(
          "student",
          "name enrollmentNo email"
        );

    res.status(200).json({

      message:
        lateDays > 0
          ? "Book returned successfully. Late fine applied."
          : "Book returned successfully.",

      lateDays,

      fine,

      finePerDay: FINE_PER_DAY,

      returnDate,

      issue: populatedIssue

    });

  } catch (error) {

    console.error("RETURN BOOK ERROR:", error);

    res.status(500).json({
      message:
        error.message || "Failed to return book"
    });
  }
};

module.exports = {
  getIssues,
  issueBook,
  returnBook
};