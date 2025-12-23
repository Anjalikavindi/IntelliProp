import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEnvelope, FaCity } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import Swal from "sweetalert2";
import "./UsersList.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    const confirm = await Swal.fire({
      title: `Delete ${name}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete"
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
        Swal.fire("Deleted!", "User has been removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Could not delete user.", "error");
      }
    }
  };

  // const handleVerifyToggle = (id) => {
  //   setUsers((prevUsers) =>
  //     prevUsers.map((user) => {
  //       if (user.id === id) {
  //         const newStatus =
  //           user.verifiedStatus === "Verified" ? "Pending" : "Verified";
  //         alert(`User ${user.name} status toggled to: ${newStatus}`);
  //         return { ...user, verifiedStatus: newStatus };
  //       }
  //       return user;
  //     })
  //   );
  // };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loader">Loading Users...</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <h2 className="list-title">Registered Users Details</h2>
        <div className="list-actions-bar">
          <input
            type="text"
            placeholder="Search by Name, Email, or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="list-search-input"
          />
          <button className="add-new-btn">+ Add New User</button>
        </div>
        <div className="table-container">
          <table className="users-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td data-label="ID">{user.id}</td>
                    <td data-label="Name" className="td-user-name">
                      <span className="user-name">{user.name}</span>
                    </td>
                    <td data-label="Email" className="td-email">
                      {user.email}
                    </td>
                    <td data-label="Mobile" className="td-mobile">
                      {user.mobile}
                    </td>
                    <td data-label="City" className="td-city">
                      <FaCity className="inline-icon" />
                      {user.city}
                    </td>
                    <td data-label="Created At" className="td-created-at">
                      {user.createdAt}
                    </td>
                    <td data-label="Status">
                      <span
                        className={`verified-status status-${user.verifiedStatus.toLowerCase()}`}
                      >
                        {user.verifiedStatus}
                      </span>
                    </td>
                    <td data-label="Actions" className="td-actions">
                      <button
                        className={`action-btn ${
                          user.verifiedStatus === "Verified"
                            ? "unverify-btn"
                            : "verified-btn"
                        }`}
                        title={
                          user.verifiedStatus === "Verified"
                            ? "Verified User"
                            : "Unverified User"
                        }
                        // onClick={() => handleVerifyToggle(user.id)}
                      >
                        <MdOutlineSecurity />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete User"
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">
                    No users found matching your search. 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-placeholder">
          {/* Pagination/Load More Controls */}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
