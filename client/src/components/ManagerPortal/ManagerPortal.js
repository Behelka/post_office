import React, { useState, useEffect } from "react";
import "./ManagerPortal.css"; // Ensure this CSS file is created for styles

const ManagerPortal = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        locationId: "",
        departmentId: "",
        supervisorId: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({ ...formData });

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/employees');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            setEmployees(result);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchLocation = async (locationId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/location/${locationId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching location:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const newEmployee = await response.json();
            setEmployees(prev => [...prev, newEmployee]);
            clearInputFields();
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    const clearInputFields = () => {
        setFormData({
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            locationId: "",
            departmentId: "",
            supervisorId: ""
        });
    };

    const handleEdit = (index) => {
        setEditMode(true);
        setEditIndex(index);
        setEditData(employees[index]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/api/employees/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const updatedEmployees = employees.map((employee, idx) =>
                idx === editIndex ? { ...employee, ...editData } : employee
            );
            setEmployees(updatedEmployees);
            setEditMode(false);
            setEditIndex(null);
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/employees/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            setEmployees(employees.filter(employee => employee.id !== id));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditIndex(null);
        setEditData({ ...formData }); // Reset the edit data to empty state
    };

    return (
        <div className="portal-container">
            <h2>Add a new Employee</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="middleName" placeholder="Middle Name (optional)" value={formData.middleName} onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} required />
                <input type="text" name="locationId" placeholder="Location ID" value={formData.locationId} onChange={handleChange} required />
                <input type="text" name="departmentId" placeholder="Department ID" value={formData.departmentId} onChange={handleChange} required />
                <input type="text" name="supervisorId" placeholder="Supervisor ID" value={formData.supervisorId} onChange={handleChange} required />
                <button type="submit">Add Employee</button>
            </form>

            <h2>Current Employees - Click On Employee ID To Edit</h2>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>Location</th>
                            <th className="center-header">Delete Employee</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={employee.id}>
                                <td>
                                    <button onClick={() => handleEdit(index)} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                        {employee.id}
                                    </button>
                                </td>
                                <td>{employee.email}</td>
                                <td>{`${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`}</td>
                                <td>{employee.phoneNumber}</td>
                                <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
                                <td>
                                    {fetchLocation(employee.locationId).then(location => (
                                        location ? `${location.houseNumber} ${location.street} ${location.suffix}, ${location.city}, ${location.state} ${location.zipCode}, ${location.country}` : 'Loading...'
                                    ))}
                                </td>
                                <td className="delete-column">
                                    <button className="button-red" onClick={() => handleDelete(employee.id)} style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editMode && (
                <div className="edit-menu">
                    <h2>Edit Employee {editData.id}</h2>
                    <form onSubmit={handleUpdate}>
                        <input type="email" name="email" placeholder="Email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} required />
                        <input type="text" name="firstName" placeholder="First Name" value={editData.firstName} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} required />
                        <input type="text" name="middleName" placeholder="Middle Name (optional)" value={editData.middleName} onChange={(e) => setEditData({ ...editData, middleName: e.target.value })} />
                        <input type="text" name="lastName" placeholder="Last Name" value={editData.lastName} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} required />
                        <input type="text" name="phoneNumber" placeholder="Phone Number" value={editData.phoneNumber} onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })} required />
                        <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={editData.dateOfBirth} onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })} required />
                        <input type="text" name="locationId" placeholder="Location ID" value={editData.locationId} onChange={(e) => setEditData({ ...editData, locationId: e.target.value })} required />
                        <input type="text" name="departmentId" placeholder="Department ID" value={editData.departmentId} onChange={(e) => setEditData({ ...editData, departmentId: e.target.value })} required />
                        <input type="text" name="supervisorId" placeholder="Supervisor ID" value={editData.supervisorId} onChange={(e) => setEditData({ ...editData, supervisorId: e.target.value })} required />
                        <button type="submit">Update Employee</button>
                        <button type="button" onClick={handleCancelEdit}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManagerPortal;

