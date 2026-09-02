const {
    createBook,
    getAllBooks: fetchAllBooks,
    getBookById,
    updateBook: modifyBook,
    deleteBook: removeBook,
    searchBooks: queryBooks
} = require("../models/bookModel");

const {
    createTransaction,
    findActiveBorrow,
    updateTransaction,
    getAllTransactions: fetchAllTransactions,
    getTransactionsByUserId
} = require("../models/transactionModel");

// ==================== GET ALL BOOKS ====================
const getAllBooks = async (req, res, next) => {
    try {
        const { category, status, author } = req.query;
        const filters = {};
        if (category) filters.category = category;
        if (status) filters.status = status;
        if (author) filters.author = author;

        const books = await fetchAllBooks(filters);
        return res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        next(error);
    }
};

// ==================== GET SINGLE BOOK ====================
const getSingleBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await getBookById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with ID: ${id}`
            });
        }

        return res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// ==================== SEARCH BOOKS ====================
const searchBooks = async (req, res, next) => {
    try {
        const searchTerm = req.query.q || req.query.title || req.query.author || "";
        const books = await queryBooks(searchTerm);

        return res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        next(error);
    }
};

// ==================== CREATE BOOK (Librarian Only) ====================
const addBook = async (req, res, next) => {
    try {
        const { title, author, isbn, category, quantity } = req.body;

        const newBook = await createBook({
            title,
            author,
            isbn,
            category,
            quantity: Number(quantity)
        });

        return res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: newBook
        });
    } catch (error) {
        next(error);
    }
};

// ==================== UPDATE BOOK (Librarian Only) ====================
const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existingBook = await getBookById(id);

        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: `Book not found with ID: ${id}`
            });
        }

        const updatedBook = await modifyBook(id, req.body);

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        });
    } catch (error) {
        next(error);
    }
};

// ==================== DELETE BOOK (Librarian Only) ====================
const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existingBook = await getBookById(id);

        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: `Book not found with ID: ${id}`
            });
        }

        await removeBook(id);

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// ==================== BORROW BOOK (Student Only) ====================
const borrowBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const book = await getBookById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with ID: ${id}`
            });
        }

        // Check if book has copies available
        if (book.quantity <= 0 || book.status === "borrowed") {
            return res.status(400).json({
                success: false,
                message: "This book is currently unavailable for borrowing"
            });
        }

        // Check if student already has an active borrow for this book
        const existingBorrow = await findActiveBorrow(userId, id);
        if (existingBorrow) {
            return res.status(400).json({
                success: false,
                message: "You already have an active borrowed copy of this book"
            });
        }

        // Decrement quantity and update book status if empty
        const newQuantity = book.quantity - 1;
        await modifyBook(id, {
            quantity: newQuantity,
            status: newQuantity === 0 ? "borrowed" : "available"
        });

        // Create borrow transaction record (14 days due date)
        const now = new Date();
        const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

        const transaction = await createTransaction({
            userId,
            bookId: id,
            type: "borrow",
            borrowDate: now,
            dueDate,
            returnDate: null,
            status: "active"
        });

        return res.status(200).json({
            success: true,
            message: "Book borrowed successfully",
            data: {
                transaction,
                remainingQuantity: newQuantity
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==================== RETURN BOOK (Student Only) ====================
const returnBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const book = await getBookById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with ID: ${id}`
            });
        }

        // Check active borrow transaction
        const activeBorrow = await findActiveBorrow(userId, id);
        if (!activeBorrow) {
            return res.status(400).json({
                success: false,
                message: "No active borrow record found for this book and user"
            });
        }

        // Check if overdue
        const returnDate = new Date();
        const dueDate = activeBorrow.dueDate?.toDate ? activeBorrow.dueDate.toDate() : new Date(activeBorrow.dueDate);
        const isOverdue = returnDate > dueDate;

        // Increment book quantity and mark available
        const newQuantity = (book.quantity || 0) + 1;
        await modifyBook(id, {
            quantity: newQuantity,
            status: "available"
        });

        // Update transaction
        const updatedTransaction = await updateTransaction(activeBorrow.transactionId, {
            type: "return",
            returnDate,
            status: isOverdue ? "overdue" : "returned"
        });

        return res.status(200).json({
            success: true,
            message: isOverdue
                ? "Book returned past due date (status: overdue)"
                : "Book returned successfully",
            data: {
                transaction: updatedTransaction,
                availableQuantity: newQuantity
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==================== TRANSACTIONS ====================
const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await fetchAllTransactions();
        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        next(error);
    }
};

const getMyTransactions = async (req, res, next) => {
    try {
        const transactions = await getTransactionsByUserId(req.user.userId);
        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBooks,
    getSingleBook,
    searchBooks,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    getAllTransactions,
    getMyTransactions
};
