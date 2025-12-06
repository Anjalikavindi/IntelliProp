import bcrypt from "bcrypt";
import db from "../../config/db.js";
import jwt from "jsonwebtoken";

export const registerUser = (req, res) => {
  const { name, email, mobile, city, password } = req.body;

  if (!name || !email || !mobile || !city || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!/^\d{9}$/.test(mobile)) {
    return res
      .status(400)
      .json({ message: "Mobile number must be 9 digits" });
  }

  // Check if email already exists
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery =
      "INSERT INTO users (name, email, mobile, city, password) VALUES (?, ?, ?, ?, ?)";

    db.query(
      insertQuery,
      [name, email, mobile, city, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Database error" });
        }

        res.json({ message: "User registered successfully" });
      }
    );
  });
};



// ----- LOGIN CONTROLLER -----
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user exists
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        city: user.city
      }
    });
  });
};


export const getLoggedUser = (req, res) => {
  const userId = req.userId; 

  if (!userId) {
    return res.status(401).json({ message: "User ID missing from token" });
  }

  const query = "SELECT id, name, email, mobile, city, is_email_verified FROM users WHERE id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result[0]);
  });
};



export const updateProfile = (req, res) => {
  const userId = req.userId; // <-- from token

  if (!userId) {
    return res.status(400).json({ message: "User ID missing from token" });
  }

  const { name, mobile, city } = req.body;

  if (!name || !mobile || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!/^\d{9}$/.test(mobile)) {
    return res.status(400).json({ message: "Mobile number must be 9 digits" });
  }

  const updateQuery = "UPDATE users SET name=?, mobile=?, city=? WHERE id=?";

  db.query(updateQuery, [name, mobile, city, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    return res.json({ message: "Profile updated successfully" });
  });
};


