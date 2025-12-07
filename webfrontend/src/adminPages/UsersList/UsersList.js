import React, { useState } from "react";
import { FaTrash, FaEnvelope, FaCity } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import "./UsersList.css";

const mockUsers = [
  {
    id: 101,
    name: "Janaka Perera",
    email: "janaka.p@usermail.com",
    mobile: "+94 77 123 4567",
    city: "Colombo",
    createdAt: "2024-10-15",
    verifiedStatus: "Verified",
  },
  {
    id: 102,
    name: "Lalitha Mendis",
    email: "lalitha.m@usermail.com",
    mobile: "+94 71 987 6543",
    city: "Kandy",
    createdAt: "2024-10-20",
    verifiedStatus: "Pending",
  },
  {
    id: 103,
    name: "Nishan Silva",
    email: "nishan.s@usermail.com",
    mobile: "+94 76 555 1111",
    city: "Galle",
    createdAt: "2024-11-01",
    verifiedStatus: "Pending",
  },
  {
    id: 104,
    name: "Priya Fernando",
    email: "priya.f@usermail.com",
    mobile: "+94 77 222 3333",
    city: "Jaffna",
    createdAt: "2024-11-15",
    verifiedStatus: "Verified",
  },
];

const UsersList = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleVerifyToggle = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === id) {
          const newStatus =
            user.verifiedStatus === "Verified" ? "Pending" : "Verified";
          alert(`User ${user.name} status toggled to: ${newStatus}`);
          return { ...user, verifiedStatus: newStatus };
        }
        return user;
      })
    );
  };

  const handleDelete = (id) => {
    const userToDelete = users.find((user) => user.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete user: ${userToDelete.name} (ID: ${id})?`
      )
    ) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    }
  }; // Filter users based on search term (name, email, mobile, or city)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <th>ID</th><th>Name</th>
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
                            ? "Unverify User"
                            : "Verify User"
                        }
                        onClick={() => handleVerifyToggle(user.id)}
                      >
                        <MdOutlineSecurity />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete User"
                        onClick={() => handleDelete(user.id)}
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
