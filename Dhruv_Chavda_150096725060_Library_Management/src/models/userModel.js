const { db } = require("../config/firebase");

const usersCollection = db.collection("users");

const createUser = async (userData) => {
    const userRef = usersCollection.doc();

    const user = {
        userId: userRef.id,
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role || "student",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await userRef.set(user);

    return user;
};

const findUserByEmail = async (email) => {
    const snapshot = await usersCollection
        .where("email", "==", email.toLowerCase())
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }

    return snapshot.docs[0].data();
};

const findUserById = async (userId) => {
    const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists) {
        return null;
    }

    return userDoc.data();
};

const updateUser = async (userId, updateData) => {
    const userRef = usersCollection.doc(userId);

    await userRef.update({
        ...updateData,
        updatedAt: new Date()
    });

    return findUserById(userId);
};

const getAllUsers = async () => {
    const snapshot = await usersCollection.get();
    const users = [];
    snapshot.forEach((doc) => {
        users.push(doc.data());
    });
    return users;
};

const deleteUser = async (userId) => {
    const userDoc = await usersCollection.doc(userId).get();
    if (!userDoc.exists) {
        return false;
    }
    await usersCollection.doc(userId).delete();
    return true;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    getAllUsers,
    deleteUser
};