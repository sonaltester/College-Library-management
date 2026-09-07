const Book = require("../models/Book")
const Student = require("../models/Student")
const Issue = require("../models/Issue")

const getDashboardStats = async (req, res) => {

  try {

    const totalBooks = await Book.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ])

    const availableBooks = await Book.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$availableQuantity" }
        }
      }
    ])

    const totalStudents =
      await Student.countDocuments()

    const issuedBooks =
      await Issue.countDocuments({
        status: "Issued"
      })

    const today = new Date()

    const overdueBooks =
      await Issue.countDocuments({
        status: "Issued",
        dueDate: { $lt: today }
      })

    const fineResult = await Issue.aggregate([
      {
        $group: {
          _id: null,
          totalFine: { $sum: "$fine" }
        }
      }
    ])

    res.json({

      totalBooks:
        totalBooks[0]?.total || 0,

      availableBooks:
        availableBooks[0]?.total || 0,

      totalStudents,

      issuedBooks,

      overdueBooks,

      totalFine:
        fineResult[0]?.totalFine || 0

    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }
}

module.exports = {
  getDashboardStats
}
