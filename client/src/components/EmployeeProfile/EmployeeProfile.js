import React, { useState } from "react";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const [employees, setEmployees] = useState([
    {
      EmployeeID: 1,
      FirstName: "Peter",
      Midname: "B",
      Lastname: "Parker",
      PhoneNumber: "0123456789",
      Address: {
        HouseNumber: "11707",
        Street: "Airport",
        Suffix: "Blvd",
        City: "Meadows Place",
        State: "TX",
        ZipCode: "77477",
        Country: "USA",
      },
      Email: "parker@gmail.com",
    },
  ]);

  const [searchEmployee, setSearchEmployee] = useState(null);
  const [employeeID, setEmployeeID] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.EmployeeID === Number(employeeID));
    setSearchEmployee(employee ? { ...employee } : { error: "Employee ID not found" });
    setEmployeeID("");
  };

  const handleEdit = () => {
    setCurrentEmployee(searchEmployee);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setEmployees(prev =>
      prev.map(emp => (emp.EmployeeID === currentEmployee.EmployeeID ? currentEmployee : emp))
    );
    setSearchEmployee(currentEmployee);
    setCurrentEmployee(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee(prev => ({
      ...prev,
      [name]: name in prev.Address ? { ...prev.Address, [name]: value } : value,
    }));
  };

  return (
    <div className="main_div">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          placeholder="Enter Employee ID"
          required
        />
        <button type="submit">Search</button>
      </form>

      {searchEmployee && (
        <div>
          {searchEmployee.error ? (
            <p>{searchEmployee.error}</p>
          ) : (
            <div>
              <p>ID: {searchEmployee.EmployeeID}</p>
              <p>Name: {`${searchEmployee.FirstName} ${searchEmployee.Midname} ${searchEmployee.Lastname}`}</p>
              <p>Phone: {searchEmployee.PhoneNumber}</p>
              <p>Address: {`${searchEmployee.Address.HouseNumber} ${searchEmployee.Address.Street} ${searchEmployee.Address.Suffix}, ${searchEmployee.Address.City}, ${searchEmployee.Address.State} ${searchEmployee.Address.ZipCode}, ${searchEmployee.Address.Country}`}</p>
              <p>Email: {searchEmployee.Email}</p>
              <button onClick={handleEdit}>Edit</button>
            </div>
          )}
        </div>
      )}

      {currentEmployee && (
        <div className="edit_div">
          <form onSubmit={handleUpdate}>
            {["FirstName", "Midname", "Lastname", "PhoneNumber", "Email"].map(field => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field}
                value={currentEmployee[field]}
                onChange={handleChange}
                required
              />
            ))}
            {["HouseNumber", "Street", "Suffix", "City", "State", "ZipCode", "Country"].map(field => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field}
                value={currentEmployee.Address[field]}
                onChange={handleChange}
                required
              />
            ))}
            <button type="submit">Save</button>
            <button type="button" onClick={() => setCurrentEmployee(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
