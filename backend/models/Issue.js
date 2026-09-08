const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    // Automatically generated when book is issued
    issueDate: {
      type: Date,
      default: Date.now,
      required: true
    },

    // Automatically generated as issueDate + 14 days
    dueDate: {
      type: Date,
      required: true
    },

    // Used internally when book is returned.
    // It is NOT shown on Issue Book form.
    returnDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["Issued", "Returned"],
      default: "Issued"
    },

    fine: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Issue", issueSchema);