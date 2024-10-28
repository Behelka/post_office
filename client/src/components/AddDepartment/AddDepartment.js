import React, { useState } from "react";
import "./AddDepartment.css";

const BasicTable = () => {
    // Sample data to display in the table
    const [data, setData] = useState([
        { department_id: 1, department_name: "Customer Service", department_manager: 1, department_location: 1 },
        { department_id: 2, department_name: "Processing", department_manager: 2, department_location: 1 },
        { department_id: 3, department_name: "Delivery", department_manager: 3, department_location: 1 },
    ]);

    // State for form inputs (department fields)
    const [departmentName, setDepartmentName] = useState("");
    const [departmentManager, setDepartmentManager] = useState("");
    const [departmentLocation, setDepartmentLocation] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null); // Track which row is being edited
    const [editDepartmentName, setEditDepartmentName] = useState("");
    const [editDepartmentManager, setEditDepartmentManager] = useState("");
    const [editDepartmentLocation, setEditDepartmentLocation] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newDepartment = {
            department_id: data.length + 1, // Increment department_id
            department_name: departmentName,
            department_manager: departmentManager,
            department_location: departmentLocation,
        };
        setData([...data, newDepartment]); // Add new department to the data array
        // Clear the input fields
        setDepartmentName("");
        setDepartmentManager("");
        setDepartmentLocation("");
    };

    const handleEdit = (index) => {
        setEditMode(true);
        setEditIndex(index);

        const department = data[index];
        setEditDepartmentName(department.department_name);
        setEditDepartmentManager(department.department_manager);
        setEditDepartmentLocation(department.department_location);
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedDepartment = {
            department_id: data[editIndex].department_id, // Keep the same department_id
            department_name: editDepartmentName,
            department_manager: editDepartmentManager,
            department_location: editDepartmentLocation,
        };

        const updatedData = data.map((department, index) =>
            index === editIndex ? updatedDepartment : department
        );

        setData(updatedData); // Update state with edited department
        setEditMode(false);
        setEditIndex(null);
    };

    return (
        <div className="table-container">
            <h2>Add a New Department</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Department Name"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Department Manager ID"
                    value={departmentManager}
                    onChange={(e) => setDepartmentManager(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Department Location ID"
                    value={departmentLocation}
                    onChange={(e) => setDepartmentLocation(e.target.value)}
                    required
                />
                <button type="submit">Add Department</button>
            </form>

            <h2>Current Departments - Click On Department ID To Edit An Existing Department</h2>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Department ID</th>
                            <th>Department Name</th>
                            <th>Manager ID</th>
                            <th>Location ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.department_id}>
                                <td>
                                    <button onClick={() => handleEdit(index)}>
                                        {item.department_id}
                                    </button>
                                </td>
                                <td>{item.department_name}</td>
                                <td>{item.department_manager}</td>
                                <td>{item.department_location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editMode && (
                <div>
                    <h2>Edit Department {editIndex + 1}</h2>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            placeholder="Department Name"
                            value={editDepartmentName}
                            onChange={(e) => setEditDepartmentName(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Department Manager ID"
                            value={editDepartmentManager}
                            onChange={(e) => setEditDepartmentManager(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Department Location ID"
                            value={editDepartmentLocation}
                            onChange={(e) => setEditDepartmentLocation(e.target.value)}
                            required
                        />
                        <button type="submit">Update Department</button>
                    </form>
                </div>
            )}
        </div>
    );
};

function AddDepartment() {

    return (
        <div>
            <BasicTable />
        </div>
    );
}

export default AddDepartment;