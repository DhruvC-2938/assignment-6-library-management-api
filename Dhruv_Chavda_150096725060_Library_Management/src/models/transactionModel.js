const { db } = require("../config/firebase");

const transactionsCollection = db.collection("transactions");

/**
 * Create a new transaction record
 * @param {Object} data
 */
const createTransaction = async (data) => {
    const txRef = transactionsCollection.doc();

    const borrowDate = data.borrowDate || new Date();
    // Default due date is 14 days after borrowDate
    const dueDate = data.dueDate || new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const transaction = {
        transactionId: txRef.id,
        userId: data.userId,
        bookId: data.bookId,
        type: data.type || "borrow",
        borrowDate: borrowDate,
        returnDate: data.returnDate || null,
        dueDate: dueDate,
        status: data.status || "active",
        createdAt: new Date()
    };

    await txRef.set(transaction);
    return transaction;
};

/**
 * Find active borrow transaction for a specific user and book
 * @param {string} userId
 * @param {string} bookId
 */
const findActiveBorrow = async (userId, bookId) => {
    const snapshot = await transactionsCollection
        .where("userId", "==", userId)
        .where("bookId", "==", bookId)
        .where("status", "==", "active")
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    return snapshot.docs[0].data();
};

/**
 * Get transaction by ID
 * @param {string} transactionId
 */
const getTransactionById = async (transactionId) => {
    const doc = await transactionsCollection.doc(transactionId).get();
    if (!doc.exists) {
        return null;
    }
    return doc.data();
};

/**
 * Update transaction record
 * @param {string} transactionId
 * @param {Object} updateData
 */
const updateTransaction = async (transactionId, updateData) => {
    const txRef = transactionsCollection.doc(transactionId);
    const existing = await getTransactionById(transactionId);
    if (!existing) {
        return null;
    }

    await txRef.update({
        ...updateData,
        updatedAt: new Date()
    });

    return getTransactionById(transactionId);
};

/**
 * Get all transactions (Librarian)
 */
const getAllTransactions = async () => {
    const snapshot = await transactionsCollection.get();
    const transactions = [];
    snapshot.forEach((doc) => {
        transactions.push(doc.data());
    });
    return transactions;
};

/**
 * Get transactions by user ID (Student)
 * @param {string} userId
 */
const getTransactionsByUserId = async (userId) => {
    const snapshot = await transactionsCollection
        .where("userId", "==", userId)
        .get();

    const transactions = [];
    snapshot.forEach((doc) => {
        transactions.push(doc.data());
    });
    return transactions;
};

module.exports = {
    createTransaction,
    findActiveBorrow,
    getTransactionById,
    updateTransaction,
    getAllTransactions,
    getTransactionsByUserId
};
