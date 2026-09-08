const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // Auto Generated Book ID
    bookId: {
      type: String,
      unique: true,
      trim: true
    },

    // ISBN
    isbn: {
      type: String,
      trim: true
    },

    // Book Title
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [2, "Book title must be at least 2 characters"]
    },

    // Author
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true
    },

    // Subject
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true
    },

    // Publisher
    publisher: {
      type: String,
      trim: true
    },

    // Edition
    edition: {
      type: String,
      trim: true
    },

    // Language
    language: {
      type: String,
      default: "English",
      trim: true
    },

    // Publication Year
    publicationYear: {
      type: Number,
      min: 1000,
      max: 2100
    },

    // Price
    price: {
      type: Number,
      min: 0,
      default: 0
    },

    // Shelf
    shelfNumber: {
      type: String,
      trim: true
    },

    // Description
    description: {
      type: String,
      trim: true
    },

    // Total Quantity
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },

    // Available Quantity
    availableQuantity: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Book", bookSchema);