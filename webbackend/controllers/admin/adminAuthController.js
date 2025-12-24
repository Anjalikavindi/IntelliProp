import bcrypt from "bcrypt";
import db from "../../config/db.js";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  const { full_name, email, role, username, password } = req.body;

  // Validate required fields
  if (!full_name || !email || !role || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check email or username exists
  const checkQuery =
    "SELECT * FROM admin_users WHERE email = ? OR username = ?";
  db.query(checkQuery, [email, username], async (err, result) => {
    if (err) {
      console.error("Database error during existence check:", err);
      return res
        .status(500)
        .json({ message: "Database error during existence check" });
    }

    if (result.length > 0) {
      // Return a specific error message for the frontend to display in SweetAlert
      const isEmail = result.some((admin) => admin.email === email);
      const isUsername = result.some((admin) => admin.username === username);

      let errorMessage = "";
      if (isEmail && isUsername) {
        errorMessage = "Email and username already exist.";
      } else if (isEmail) {
        errorMessage = "Email already exists.";
      } else {
        errorMessage = "Username already exists.";
      }

      return res.status(400).json({ message: errorMessage });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery =
      "INSERT INTO admin_users (full_name, email, role_id, username, password) VALUES (?, ?, ?, ?, ?)";

    db.query(
      insertQuery,
      [full_name, email, role, username, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Database error during insertion:", err);
          return res
            .status(500)
            .json({ message: "Database error during registration" });
        }

        // OPTIONAL: Issue JWT token after registration
        // const adminId = result.insertId;
        // const token = jwt.sign(
        //   { id: adminId, role: "admin" },
        //   process.env.JWT_SECRET || "admin_secret_key",
        //   { expiresIn: "7d" }
        // );

        // Success response for the frontend (AdminRegister.js)
        return res.status(201).json({
          // Use 201 Created status
          message: "Admin registered successfully",
          token,
          admin: {
            id: adminId,
            full_name,
            email,
            username,
          },
        });
      }
    );
  });
};

// handle Admin Login
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // 1. Basic validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // 2. Find admin by username
  const query = `
    SELECT au.*, ar.role_name 
  FROM admin_users au
  JOIN admin_roles ar ON au.role_id = ar.id
  WHERE au.username = ?`;

  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ message: "Database error during login" });
    }

    if (results.length === 0) {
      // Admin user not found
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const admin = results[0];

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      // Password does not match
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 4. Generate JWT Token
    const token = jwt.sign(
      { id: admin.id, role: admin.role_name, role_id: admin.role_id },
      process.env.JWT_SECRET || "admin_secret_key",
      { expiresIn: "7d" }
    );

    // 5. Success response
    return res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        username: admin.username,
        role: admin.role_name, // Include role for frontend usage
      },
    });
  });
};

// Admin list
export const getAdminsList = async (req, res) => {
  const query = `
    SELECT 
      au.id, 
      au.full_name AS name, 
      au.username, 
      au.email, 
      ar.role_name AS role 
    FROM admin_users au
    JOIN admin_roles ar ON au.role_id = ar.id
    ORDER BY au.id ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching admins:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};

//Logged in admin
export const getAdminProfile = async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      au.id, 
      au.full_name AS name, 
      au.username, 
      au.email, 
      au.created_at,
      ar.role_name AS role 
    FROM admin_users au
    JOIN admin_roles ar ON au.role_id = ar.id
    WHERE au.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(results[0]);
  });
};

//Delete admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM admin_users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting admin" });
    res.status(200).json({ message: "Admin removed successfully" });
  });
};