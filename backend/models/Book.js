const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"]
    },

    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0
    }
  },

  {
    timestamps: true
  }
)

module.exports = mongoose.model("Book", bookSchema)
