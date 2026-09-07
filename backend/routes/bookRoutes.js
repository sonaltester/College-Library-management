const express = require("express")

const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookCount,
  getBookQuantity
} = require("../controllers/bookController")

const router = express.Router()

router.get("/", getBooks)
router.get("/count", getBookCount)
router.get("/quantity", getBookQuantity)

router.post("/", createBook)
router.put("/:id", updateBook)
router.delete("/:id", deleteBook)

module.exports = router
