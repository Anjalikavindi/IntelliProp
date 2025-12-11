import db from "../../config/db.js";

export const getAdminRoles = (req, res) => {
  const query = "SELECT id, role_name FROM admin_roles";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    return res.json(results);
  });
};
