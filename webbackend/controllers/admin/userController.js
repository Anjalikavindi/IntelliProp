import db from "../../config/db.js";

/**
 * @desc Fetch all registered users
 * @route GET /api/admin/users
 */
export const getUsersList = async (req, res) => {
    try {
        const query = `
            SELECT id, name, email, mobile, city, created_at, is_email_verified 
            FROM users 
            ORDER BY created_at DESC
        `;
        const [users] = await db.promise().query(query);

        // Format data for frontend
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            city: user.city,
            createdAt: new Date(user.created_at).toLocaleDateString('en-CA'), // YYYY-MM-DD
            verifiedStatus: user.is_email_verified ? "Verified" : "Pending"
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error while fetching users." });
    }
};

/**
 * @desc Delete a user
 * @route DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.promise().query("DELETE FROM users WHERE id = ?", [id]);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};