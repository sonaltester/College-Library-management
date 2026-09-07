const Book = require("../models/Book")
const Issue = require("../models/Issue")


const getBooks = async (req, res) => {

  try {

    const books = await Book.find()
      .sort({ createdAt: -1 })

    res.json(books)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}


const createBook = async (req, res) => {

  try {

    const {
      title,
      author,
      category,
      quantity
    } = req.body

    const book = await Book.create({
      title,
      author,
      category,
      quantity,
      availableQuantity: quantity
    })

    res.status(201).json(book)

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}


const updateBook = async (req, res) => {

  try {

    const {
      title,
      author,
      category,
      quantity
    } = req.body

    const book = await Book.findById(
      req.params.id
    )

    if (!book) {

      return res.status(404).json({
        message: "Book not found"
      })

    }


    const issuedBooks =
      book.quantity -
      book.availableQuantity


    if (quantity < issuedBooks) {

      return res.status(400).json({
        message:
          `Quantity cannot be less than ${issuedBooks} issued book(s)`
      })

    }


    book.title = title
    book.author = author
    book.category = category
    book.quantity = quantity

    book.availableQuantity =
      quantity - issuedBooks


    await book.save()

    res.json(book)

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}


const deleteBook = async (req, res) => {

  try {

    const bookId = req.params.id


    // Delete all related issue records
    await Issue.deleteMany({
      book: bookId
    })


    // Delete the book
    const book =
      await Book.findByIdAndDelete(
        bookId
      )


    if (!book) {

      return res.status(404).json({
        message: "Book not found"
      })

    }


    res.json({
      message:
        "Book and related records deleted successfully"
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}


const getBookCount = async (req, res) => {

  try {

    const count =
      await Book.countDocuments()

    res.json({ count })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}


const getBookQuantity = async (req, res) => {

  try {

    const result =
      await Book.aggregate([

        {
          $group: {

            _id: null,

            total: {
              $sum: "$quantity"
            },

            available: {
              $sum:
                "$availableQuantity"
            }

          }
        }

      ])


    res.json(

      result[0] || {

        total: 0,

        available: 0

      }

    )

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}


module.exports = {

  getBooks,

  createBook,

  updateBook,

  deleteBook,

  getBookCount,

  getBookQuantity

}