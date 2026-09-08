const Book = require("../models/Book");
const Issue = require("../models/Issue");


// ==========================================
// GENERATE BOOK ID
// ==========================================

const generateBookId = async () => {

  const lastBook = await Book.findOne(
    {
      bookId: { $regex: /^BK-\d+$/ }
    },
    {
      bookId: 1
    }
  ).sort({ bookId: -1 });

  if (!lastBook || !lastBook.bookId) {
    return "BK-0001";
  }

  const lastNumber = parseInt(
    lastBook.bookId.replace("BK-", ""),
    10
  );

  const nextNumber = lastNumber + 1;

  return `BK-${String(nextNumber).padStart(4, "0")}`;
};


// ==========================================
// GET ALL BOOKS
// ==========================================

const getBooks = async (req, res) => {

  try {

    const books = await Book.find()
      .sort({ createdAt: -1 });

    res.status(200).json(books);

  } catch (error) {

    console.error("GET BOOKS ERROR:", error);

    res.status(500).json({
      message: error.message || "Unable to fetch books"
    });

  }
};


// ==========================================
// CREATE BOOK
// ==========================================

const createBook = async (req, res) => {

  try {

    const {
      isbn,
      title,
      author,
      subject,
      publisher,
      edition,
      language,
      publicationYear,
      price,
      shelfNumber,
      description,
      quantity
    } = req.body;


    // Required fields
    if (
      !title ||
      !author ||
      !subject ||
      quantity === undefined ||
      quantity === ""
    ) {

      return res.status(400).json({
        message:
          "Book title, author, subject and quantity are required"
      });

    }


    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();
    const cleanSubject = subject.trim();


    if (cleanTitle.length < 2) {

      return res.status(400).json({
        message: "Book title must be at least 2 characters"
      });

    }


    if (cleanAuthor.length < 2) {

      return res.status(400).json({
        message: "Author name must be at least 2 characters"
      });

    }


    if (cleanSubject.length < 2) {

      return res.status(400).json({
        message: "Subject must be at least 2 characters"
      });

    }


    const bookQuantity = Number(quantity);


    if (
      !Number.isInteger(bookQuantity) ||
      bookQuantity < 1
    ) {

      return res.status(400).json({
        message: "Quantity must be at least 1"
      });

    }


    // Generate Book ID
    const bookId = await generateBookId();


    const book = await Book.create({

      bookId,

      isbn: isbn?.trim() || "",

      title: cleanTitle,

      author: cleanAuthor,

      subject: cleanSubject,

      publisher: publisher?.trim() || "",

      edition: edition?.trim() || "",

      language: language?.trim() || "English",

      publicationYear:
        publicationYear !== ""
          ? Number(publicationYear)
          : undefined,

      price:
        price !== undefined && price !== ""
          ? Number(price)
          : 0,

      shelfNumber: shelfNumber?.trim() || "",

      description: description?.trim() || "",

      quantity: bookQuantity,

      availableQuantity: bookQuantity

    });


    res.status(201).json({

      message: "Book added successfully",

      book

    });


  } catch (error) {

    console.error("CREATE BOOK ERROR:", error);

    res.status(400).json({
      message: error.message || "Unable to add book"
    });

  }
};


// ==========================================
// UPDATE BOOK
// ==========================================

const updateBook = async (req, res) => {

  try {

    const {
      isbn,
      title,
      author,
      subject,
      publisher,
      edition,
      language,
      publicationYear,
      price,
      shelfNumber,
      description,
      quantity
    } = req.body;


    const book = await Book.findById(
      req.params.id
    );


    if (!book) {

      return res.status(404).json({
        message: "Book not found"
      });

    }


    const newQuantity = Number(quantity);


    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1
    ) {

      return res.status(400).json({
        message: "Quantity must be at least 1"
      });

    }


    // Already issued books
    const issuedBooks =
      Number(book.quantity) -
      Number(book.availableQuantity);


    // Quantity cannot be less than issued
    if (newQuantity < issuedBooks) {

      return res.status(400).json({

        message:
          `Quantity cannot be less than ${issuedBooks} issued book(s)`

      });

    }


    book.isbn =
      isbn?.trim() || "";

    book.title =
      title?.trim() || "";

    book.author =
      author?.trim() || "";

    book.subject =
      subject?.trim() || "";

    book.publisher =
      publisher?.trim() || "";

    book.edition =
      edition?.trim() || "";

    book.language =
      language?.trim() || "English";

    book.publicationYear =
      publicationYear !== ""
        ? Number(publicationYear)
        : undefined;

    book.price =
      price !== undefined && price !== ""
        ? Number(price)
        : 0;

    book.shelfNumber =
      shelfNumber?.trim() || "";

    book.description =
      description?.trim() || "";

    book.quantity =
      newQuantity;


    // Preserve issued books
    book.availableQuantity =
      newQuantity - issuedBooks;


    await book.save();


    res.status(200).json({

      message: "Book updated successfully",

      book

    });


  } catch (error) {

    console.error("UPDATE BOOK ERROR:", error);

    res.status(400).json({
      message: error.message || "Unable to update book"
    });

  }
};


// ==========================================
// DELETE BOOK
// ==========================================

const deleteBook = async (req, res) => {

  try {

    const bookId = req.params.id;


    const book = await Book.findById(bookId);


    if (!book) {

      return res.status(404).json({
        message: "Book not found"
      });

    }


    // Remove related issue records
    await Issue.deleteMany({
      book: bookId
    });


    await Book.findByIdAndDelete(bookId);


    res.status(200).json({

      message:
        "Book and related issue records deleted successfully"

    });


  } catch (error) {

    console.error("DELETE BOOK ERROR:", error);

    res.status(500).json({
      message: error.message || "Unable to delete book"
    });

  }
};


// ==========================================
// BOOK COUNT
// ==========================================

const getBookCount = async (req, res) => {

  try {

    const count =
      await Book.countDocuments();

    res.status(200).json({
      count
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// ==========================================
// BOOK QUANTITY
// ==========================================

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
              $sum: "$availableQuantity"
            }

          }

        }

      ]);


    res.status(200).json(

      result[0] || {
        total: 0,
        available: 0
      }

    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


module.exports = {

  getBooks,

  createBook,

  updateBook,

  deleteBook,

  getBookCount,

  getBookQuantity

};