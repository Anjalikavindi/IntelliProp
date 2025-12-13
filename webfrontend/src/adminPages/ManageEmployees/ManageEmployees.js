import React, { useState } from "react";
import { FaTrash, FaEnvelope, FaCity } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";

const mockEmployees = [
  {
    id: 101,
    name: "Janaka Perera",
    username: "Janaka",
    email: "janaka.p@usermail.com",
    mobile: "+94 77 123 4567",
    role: "Admin",
  },
  {
    id: 102,
    name: "Lalitha Mendis",
    username: "Mendis",
    email: "lalitha.m@usermail.com",
    mobile: "+94 71 987 6543",
    role: "Manager",
  },
  {
    id: 103,
    name: "Nishan Silva",
    username: "Nish",
    email: "nishan.s@usermail.com",
    mobile: "+94 76 555 1111",
    role: "Super Admin",
  },
  {
    id: 104,
    name: "Priya Fernando",
    username: "Priya25",
    email: "priya.f@usermail.com",
    mobile: "+94 77 222 3333",
    role: "Manager",
  },
];

const ManageEmployees = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = (id) => {
    const employeeToDelete = employees.find((employee) => employee.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete employee: ${employeeToDelete.name} (ID: ${id})?`
      )
    ) {
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id)
      );
    }
  }; // Filter employees based on search term (name, email, mobile, or city)

  const filteredEmployee = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mobile.includes(searchTerm)
  );

  return (
    <div className="dashboard-wrapper">
      <div className="admin-dashboard-content padding-top">
        <h2 className="list-title">Registered Employees Details</h2>
        <div className="list-actions-bar">
          <input
            type="text"
            placeholder="Search by Name, Email, or Mobile..."
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
                <th>Mobile</th>
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
                    <td data-label="Mobile" className="td-mobile">
                      {employee.mobile}
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
                        onClick={() => handleDelete(employee.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
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
