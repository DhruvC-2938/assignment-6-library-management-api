const { db } = require("../config/firebase");

const booksCollection = db.collection("books");

/**
 * Create a new book
 * @param {Object} bookData
 */
const createBook = async (bookData) => {
    const bookRef = booksCollection.doc();
    const quantity = Number(bookData.quantity);

    const book = {
        bookId: bookRef.id,
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        category: bookData.category,
        status: quantity > 0 ? "available" : "borrowed",
        quantity: quantity,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await bookRef.set(book);
    return book;
};

/**
 * Get all books with optional filters
 * @param {Object} filters - { category, status, author }
 */
const getAllBooks = async (filters = {}) => {
    let query = booksCollection;

    if (filters.category) {
        query = query.where("category", "==", filters.category);
    }
    if (filters.status) {
        query = query.where("status", "==", filters.status);
    }
    if (filters.author) {
        query = query.where("author", "==", filters.author);
    }

    const snapshot = await query.get();
    const books = [];
    snapshot.forEach((doc) => {
        books.push(doc.data());
    });

    return books;
};

/**
 * Find a book by its ID
 * @param {string} bookId
 */
const getBookById = async (bookId) => {
    const bookDoc = await booksCollection.doc(bookId).get();
    if (!bookDoc.exists) {
        return null;
    }
    return bookDoc.data();
};

/**
 * Update an existing book
 * @param {string} bookId
 * @param {Object} updateData
 */
const updateBook = async (bookId, updateData) => {
    const bookRef = booksCollection.doc(bookId);
    const existing = await getBookById(bookId);
    if (!existing) {
        return null;
    }

    const updates = { ...updateData, updatedAt: new Date() };

    if (updates.quantity !== undefined) {
        updates.quantity = Number(updates.quantity);
        if (!updates.status) {
            updates.status = updates.quantity > 0 ? "available" : "borrowed";
        }
    }

    await bookRef.update(updates);
    return getBookById(bookId);
};

/**
 * Delete a book by ID
 * @param {string} bookId
 */
const deleteBook = async (bookId) => {
    const bookDoc = await booksCollection.doc(bookId).get();
    if (!bookDoc.exists) {
        return false;
    }
    await booksCollection.doc(bookId).delete();
    return true;
};

/**
 * Search books by title or author (case-insensitive substring match)
 * @param {string} searchTerm
 */
const searchBooks = async (searchTerm) => {
    if (!searchTerm) {
        return getAllBooks();
    }

    const snapshot = await booksCollection.get();
    const lowerTerm = searchTerm.toLowerCase();
    const results = [];

    snapshot.forEach((doc) => {
        const data = doc.data();
        const matchesTitle = data.title && data.title.toLowerCase().includes(lowerTerm);
        const matchesAuthor = data.author && data.author.toLowerCase().includes(lowerTerm);
        const matchesCategory = data.category && data.category.toLowerCase().includes(lowerTerm);

        if (matchesTitle || matchesAuthor || matchesCategory) {
            results.push(data);
        }
    });

    return results;
};

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    searchBooks
};
