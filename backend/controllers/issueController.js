const Issue = require("../models/Issue")
const Book = require("../models/Book")
const Student = require("../models/Student")

// ==========================================
// GET ALL ISSUE RECORDS
// ==========================================

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate({
        path: "book",
        select: "title author category quantity availableQuantity"
      })
      .populate({
        path: "student",
        select: "name enrollmentNo email course semester"
      })
      .sort({ createdAt: -1 })

    res.json(issues)

  } catch (error) {
    console.error("GET ISSUES ERROR:", error)

    res.status(500).json({
      message: error.message
    })
  }
}


// ==========================================
// ISSUE BOOK
// ==========================================

const issueBook = async (req, res) => {
  try {

    const {
      book,
      student,
      dueDate
    } = req.body

    // Check book
    const selectedBook =
      await Book.findById(book)

    if (!selectedBook) {
      return res.status(404).json({
        message: "Book not found"
      })
    }

    // Check student
    const selectedStudent =
      await Student.findById(student)

    if (!selectedStudent) {
      return res.status(404).json({
        message: "Student not found"
      })
    }

    // Check availability
    if (
      selectedBook.availableQuantity <= 0
    ) {
      return res.status(400).json({
        message: "Book is not available"
      })
    }

    // Check duplicate issue
    const existingIssue =
      await Issue.findOne({
        book,
        student,
        status: "Issued"
      })

    if (existingIssue) {
      return res.status(400).json({
        message:
          "This book is already issued to this student"
      })
    }

    // Create issue record
    const issue =
      await Issue.create({
        book,
        student,
        dueDate,
        status: "Issued"
      })

    // Decrease available quantity
    await Book.findByIdAndUpdate(
      book,
      {
        $inc: {
          availableQuantity: -1
        }
      },
      {
        runValidators: false
      }
    )

    // Return populated issue
    const result =
      await Issue.findById(issue._id)
        .populate("book")
        .populate("student")

    res.status(201).json(result)

  } catch (error) {

    console.error(
      "ISSUE BOOK ERROR:",
      error
    )

    res.status(400).json({
      message:
        error.message ||
        "Book issue failed"
    })
  }
}


// ==========================================
// RETURN BOOK
// ==========================================

const returnBook = async (req, res) => {
  try {

    const issueId = req.params.id

    // Check issue record
    const issue =
      await Issue.findById(issueId)

    if (!issue) {
      return res.status(404).json({
        message:
          "Issue record not found"
      })
    }

    // Already returned?
    if (issue.status === "Returned") {
      return res.status(400).json({
        message:
          "Book already returned"
      })
    }

    // ======================================
    // CALCULATE LATE DAYS
    // ======================================

    const returnDate = new Date()

    const dueDate =
      new Date(issue.dueDate)

    const difference =
      returnDate.getTime() -
      dueDate.getTime()

    const lateDays = Math.max(
      0,
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      )
    )

    // ₹5 per late day
    const fine =
      lateDays * 5


    // ======================================
    // UPDATE ISSUE RECORD
    // ======================================

    issue.status = "Returned"

    issue.returnDate = returnDate

    issue.fine = fine

    await issue.save()


    // ======================================
    // INCREASE BOOK AVAILABLE QUANTITY
    // ======================================
    //
    // IMPORTANT:
    // Do NOT use:
    //
    // const book = await Book.findById(...)
    // book.availableQuantity += 1
    // await book.save()
    //
    // because Book schema has required
    // "subject" field and old books may not
    // have subject.
    //
    // $inc updates only availableQuantity.
    // ======================================

    await Book.findOneAndUpdate(
      {
        _id: issue.book
      },
      {
        $inc: {
          availableQuantity: 1
        }
      },
      {
        runValidators: false
      }
    )


    // ======================================
    // RESPONSE
    // ======================================

    res.json({
      message:
        "Book returned successfully",

      fine,

      lateDays,

      returnDate
    })

  } catch (error) {

    console.error(
      "RETURN BOOK ERROR:",
      error
    )

    res.status(500).json({
      message:
        error.message ||
        "Book return failed"
    })
  }
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getIssues,
  issueBook,
  returnBook
}