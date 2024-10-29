import React, { useState, useEffect } from "react";
import "./AddDepartment.css";

const  AddDepartment = () => {
    const [data, setData] = useState([]);
    const [departmentFields, setDepartmentFields] = useState({
        departmentName: "",
        departmentManager: "",
        departmentLocation: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editFields, setEditFields] = useState({ ...departmentFields });

    // Fetch departments from the API
    const fetchDepartments = async () => {
        try {
            const response = await fetch('http://localhost:3001/departments');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            
            const formattedData = result.map((item) => ({
                department_id: item.Department_ID,
                department_name: item.Department_Name,
                department_manager: item.Department_Manager_ID,
                department_location: item.Department_Location_ID
            }));
            setData(formattedData);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDepartmentFields((prev) => ({ ...prev, [name]: value }));
    };

    const clearInputFields = () => {
        setDepartmentFields({
            departmentName: "",
            departmentManager: "",
            departmentLocation: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDepartment = { ...departmentFields };

        try {
            const response = await fetch('http://localhost:3001/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDepartment),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();

            setData((prev) => [...prev, result]);
            clearInputFields();
        } catch (error) {
            console.error('Error adding department:', error);
        }
    };

    const handleEdit = (index) => {
        setEditMode(true);
        setEditIndex(index);
        const department = data[index];
        setEditFields({
            departmentName: department.department_name,
            departmentManager: department.department_manager,
            departmentLocation: department.department_location
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedDepartment = { ...editFields };

        try {
            const response = await fetch(`http://localhost:3001/departments/${data[editIndex].department_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDepartment),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const updatedData = data.map((department, idx) =>
                idx === editIndex ? { ...department, ...editFields } : department
            );

            setData(updatedData);
            setEditMode(false);
            setEditIndex(null);
        } catch (error) {
            console.error('Error updating department:', error);
        }
    };

    const handleDelete = async (department_id) => {
        try {
            const response = await fetch(`http://localhost:3001/departments/${department_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            setData((prev) =>
                prev.map(department =>
                    department.department_id === department_id ? { ...department, Delete_Department: 1 } : department
                )
            );
            fetchDepartments(); // Update display
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    return (
        <div className="table-container">
            <h2>Add a New Department</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(departmentFields).map((key) => (
                    <input 
                        key={key}
                        type="text"
                        name={key}
                        placeholder={key.replace(/([A-Z])/g, ' $1')} // Format name for placeholder
                        value={departmentFields[key]}
                        onChange={handleInputChange}
                        required
                    />
                ))}
                <button type="submit">Add Department</button>
            </form>

            <h2>Current Departments - Click On Department ID To Edit</h2>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Department ID</th>
                            <th>Department Name</th>
                            <th>Manager ID</th>
                            <th>Location ID</th>
                            <th className="center-header">Delete Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.department_id}>
                                <td>
                                    <button onClick={() => handleEdit(index)} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                        {item.department_id}
                                    </button>
                                </td>
                                <td>{item.department_name}</td>
                                <td>{item.department_manager}</td>
                                <td>{item.department_location}</td>
                                <td className="delete-column">
                                    <button className="button-red"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(item.department_id);
                                        }}
                                        style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editMode && (
                <div>
                    <h2>Edit Department {data[editIndex].department_id}</h2>
                    <form onSubmit={handleUpdate}>
                        {Object.keys(editFields).map((key) => (
                            <input 
                                key={key}
                                type="text"
                                name={key}
                                placeholder={key.replace(/([A-Z])/g, ' ')} // Format name for placeholder
                                value={editFields[key]}
                                onChange={(e) => setEditFields((prev) => ({ ...prev, [key]: e.target.value }))} 
                                required
                            />
                        ))}
                        <button type="submit">Update Department</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddDepartment;
