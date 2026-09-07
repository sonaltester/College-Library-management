const express = require("express")

const {
  getIssues,
  issueBook,
  returnBook
} = require("../controllers/issueController")

const router = express.Router()

router.get("/", getIssues)
router.post("/", issueBook)
router.put("/:id/return", returnBook)

module.exports = router
