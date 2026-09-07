const Issue = require("../models/Issue")
const Book = require("../models/Book")
const Student = require("../models/Student")

// ================= GET ALL ISSUES =================
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
    res.status(500).json({
      message: error.message
    })
  }
}


// ================= ISSUE BOOK =================
const issueBook = async (req, res) => {
  try {
    const { book, student, issueDate } = req.body

    // Book and student required
    if (!book || !student) {
      return res.status(400).json({
        message: "Book and student are required"
      })
    }

    // ================= ISSUE DATE =================
    // Agar admin date select karega to wahi date use hogi.
    // Agar date nahi bheji gayi to today's date use hogi.

    const selectedIssueDate = issueDate
      ? new Date(issueDate)
      : new Date()

    // Invalid date check
    if (isNaN(selectedIssueDate.getTime())) {
      return res.status(400).json({
        message: "Invalid issue date"
      })
    }

    // ================= DUE DATE =================
    // Automatically Issue Date + 7 days

    const dueDate = new Date(selectedIssueDate)
    dueDate.setDate(dueDate.getDate() + 7)


    // ================= FIND BOOK =================

    const selectedBook = await Book.findById(book)

    if (!selectedBook) {
      return res.status(404).json({
        message: "Book not found"
      })
    }


    // ================= FIND STUDENT =================

    const selectedStudent = await Student.findById(student)

    if (!selectedStudent) {
      return res.status(404).json({
        message: "Student not found"
      })
    }


    // ================= CHECK BOOK AVAILABLE =================

    if (selectedBook.availableQuantity <= 0) {
      return res.status(400).json({
        message: "Book is not available"
      })
    }


    // ================= DUPLICATE ISSUE CHECK =================

    const existingIssue = await Issue.findOne({
      book,
      student,
      status: "Issued"
    })

    if (existingIssue) {
      return res.status(400).json({
        message: "This book is already issued to this student"
      })
    }


    // ================= CREATE ISSUE =================

    const issue = await Issue.create({
      book,
      student,
      issueDate: selectedIssueDate,
      dueDate: dueDate,
      returnDate: null,
      status: "Issued",
      fine: 0
    })


    // ================= REDUCE BOOK QUANTITY =================

    selectedBook.availableQuantity -= 1

    await selectedBook.save()


    // ================= RESPONSE =================

    const result = await Issue.findById(issue._id)
      .populate("book")
      .populate("student")

    res.status(201).json(result)

  } catch (error) {

    console.error("Issue Book Error:", error)

    res.status(400).json({
      message: error.message || "Book issue failed"
    })
  }
}


// ================= RETURN BOOK =================
const returnBook = async (req, res) => {
  try {

    const issue = await Issue.findById(req.params.id)

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found"
      })
    }


    // Already returned
    if (issue.status === "Returned") {
      return res.status(400).json({
        message: "Book already returned"
      })
    }


    // ================= RETURN DATE =================

    const returnDate = new Date()

    const dueDate = new Date(issue.dueDate)


    // ================= CALCULATE LATE DAYS =================

    const returnDay = Date.UTC(
      returnDate.getFullYear(),
      returnDate.getMonth(),
      returnDate.getDate()
    )

    const dueDay = Date.UTC(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    )

    const difference = returnDay - dueDay

    const lateDays = Math.max(
      0,
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      )
    )


    // ================= FINE =================
    // ₹5 per late day

    const fine = lateDays * 5


    // ================= UPDATE ISSUE =================

    issue.status = "Returned"
    issue.returnDate = returnDate
    issue.fine = fine

    await issue.save()


    // ================= INCREASE AVAILABLE QUANTITY =================

    const book = await Book.findById(issue.book)

    if (book) {

      if (book.availableQuantity < book.quantity) {

        book.availableQuantity += 1

        await book.save()
      }
    }


    res.json({
      message: "Book returned successfully",
      fine,
      lateDays
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
}


module.exports = {
  getIssues,
  issueBook,
  returnBook
}