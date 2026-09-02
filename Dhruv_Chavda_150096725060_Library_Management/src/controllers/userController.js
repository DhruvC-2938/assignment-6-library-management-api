const {
    getAllUsers: fetchUsers,
    findUserById,
    updateUser,
    deleteUser: removeUser
} = require("../models/userModel");

// ==================== GET ALL USERS (Librarian Only) ====================
const getAllUsers = async (req, res, next) => {
    try {
        const users = await fetchUsers();
        // Sanitize out passwords
        const safeUsers = users.map((user) => {
            const { password: _, ...safeUser } = user;
            return safeUser;
        });

        return res.status(200).json({
            success: true,
            count: safeUsers.length,
            data: safeUsers
        });
    } catch (error) {
        next(error);
    }
};

// ==================== GET USER BY ID (Librarian Only) ====================
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with ID: ${id}`
            });
        }

        const { password: _, ...safeUser } = user;
        return res.status(200).json({
            success: true,
            data: safeUser
        });
    } catch (error) {
        next(error);
    }
};

// ==================== UPDATE USER ROLE (Librarian Only) ====================
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with ID: ${id}`
            });
        }

        const updatedUser = await updateUser(id, { role });
        const { password: _, ...safeUser } = updatedUser;

        return res.status(200).json({
            success: true,
            message: `User role updated to '${role}' successfully`,
            data: safeUser
        });
    } catch (error) {
        next(error);
    }
};

// ==================== DELETE USER (Librarian Only) ====================
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Prevent librarian from deleting themselves
        if (req.user && req.user.userId === id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with ID: ${id}`
            });
        }

        await removeUser(id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
};
