import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEnvelope, FaCity } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import Swal from "sweetalert2";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/auth/admins");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

//   const handleVerifyToggle = (id) => {
//     setEmployees((prevEmployees) =>
//       prevEmployees.map((employee) => {
//         if (employee.id === id) {
//           const newStatus =
//             employee.verifiedStatus === "Verified" ? "Pending" : "Verified";
//           alert(`Employee ${employee.name} status toggled to: ${newStatus}`);
//           return { ...employee, verifiedStatus: newStatus };
//         }
//         return employee;
//       })
//     );
//   };

  const handleDelete = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Delete admin ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete"
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/auth/admins/${id}`);
        setEmployees(employees.filter((emp) => emp.id !== id));
        Swal.fire("Deleted!", "Admin has been removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Could not delete admin.", "error");
      }
    }
  };

  const filteredEmployee = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <h2 className="list-title">Registered Employees Details</h2>
        <div className="list-actions-bar">
          <input
            type="text"
            placeholder="Search by Name, Email, or Username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="list-search-input"
          />
          <button className="add-new-btn">+ Add New Employee</button>
        </div>
        <div className="table-container">
          <table className="users-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployee.length > 0 ? (
                filteredEmployee.map((employee) => (
                  <tr key={employee.id}>
                    <td data-label="ID">{employee.id}</td>
                    <td data-label="Name" className="td-user-name">
                      <span className="user-name">{employee.name}</span>
                    </td>
                    <td data-label="Username" className="td-user-name">
                      <span className="user-name">{employee.username}</span>
                    </td>
                    <td data-label="Email" className="td-email">
                      {employee.email}
                    </td>
                    <td data-label="Role" className="td-role">
                      <span className="user-role">{employee.role}</span>
                    </td>
                    <td data-label="Actions" className="td-actions">
                      {/* <button
                        className={`action-btn ${
                          employee.verifiedStatus === "Verified"
                            ? "unverify-btn"
                            : "verified-btn"
                        }`}
                        title={
                          employee.verifiedStatus === "Verified"
                            ? "Unverify Employee"
                            : "Verify Employee"
                        }
                        onClick={() => handleVerifyToggle(employee.id)}
                      >
                        <MdOutlineSecurity />
                      </button> */}
                      <button
                        className="action-btn delete-btn"
                        title="Delete Employee"
                        onClick={() => handleDelete(employee.id, employee.name)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No employees found matching your search.
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

export default ManageEmployees;
