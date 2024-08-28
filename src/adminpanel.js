import React, { useEffect, useState } from "react"; 
import { Accordion, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './adminpanel.scss';
import axios from "axios";

const AdminPanel = () => {

    const [allRoles, setAllRoles] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [allProcesses, setAllProcesses] = useState([]);
    const [allObjects, setAllObjects] = useState([]);
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [correntHelpWindows, setCorrentHelpWindows] = useState('');
    const rolesApi = 'http://192.168.101.226:5555/api/roles';
    const usersApi = 'http://192.168.101.226:5555/api/users';
    const departmentsApi = 'http://192.168.101.226:5555/api/departments';
    const processApi = 'http://192.168.101.226:5555/api/processes';
    const objectApi = 'http://192.168.101.226:5555/api/objects';

    useEffect(() => {
        setCorrentHelpWindows('')
        const token = localStorage.getItem('token');
        console.log(token);
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        GetInfo(config);
    }, []);

    const windowsHelpHandChanger = (e) => {
        setCorrentHelpWindows('');
        setCorrentHelpWindows(e)
        console.log(`help windows: ${windowsHelpHandChanger}`);
        
    }
    const GetInfo = async (config) => {
        try {
            const getAllRoles = await axios.get(`${rolesApi}/roles`, config);
            setAllRoles(getAllRoles.data);
            console.log(allRoles);
            
            const getAllUsers = await axios.get(`${usersApi}/users`, config);
            setAllUsers(getAllUsers.data);

            const getAllDepartments = await axios.get(`${departmentsApi}/departments`, config);
            setAllDepartments(getAllDepartments.data);

            const getAllObjects = await axios.get(`${objectApi}/objects`, config);
            setAllObjects(getAllObjects.data);

            const getAllProcesses = await axios.get(`${processApi}/processes`, config);
            setAllProcesses(getAllProcesses.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        
        try {
            const response = await axios.post(`${departmentsApi}/newdepartment`, { departmentName: newDepartmentName }, config);
            console.log('Department created:', response.data);
            setNewDepartmentName(''); // Clear input
            GetInfo(config); // Refresh data
        } catch (error) {
            console.error('Error creating department:', error);
        }
    };

    return(
        <div>
            <div className="help-window">

            </div>
            <Container>
                <h1>Admin Panel</h1>
                <Accordion defaultActiveKey={0}>
                    <Accordion.Item eventKey="0" >
                        <Accordion.Header onClick={()=>windowsHelpHandChanger('departments')}>Add Departments</Accordion.Header>
                        <Accordion.Body>
                            <form onSubmit={handleCreateDepartment}>
                                <label>
                                    Department Name:
                                    <input
                                        type="text"
                                        name="departmentName"
                                        value={newDepartmentName}
                                        onChange={(e) => setNewDepartmentName(e.target.value)}
                                    />
                                </label>
                                <button type="submit">Submit</button>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Add Process</Accordion.Header>
                        <Accordion.Body>
                            <form className="AddProcessForm">
                                <label>Process Name:
                                    <input type="text" name="processName" />
                                </label>
                                {/* Add more fields as needed */}
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Add Object</Accordion.Header>
                        <Accordion.Body>
                            <form className="AddObjectForm">
                                <label>Task Name:
                                    <input type="text" name="objectName" />
                                </label>
                                <button type="submit">Submit</button>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Add User</Accordion.Header>
                        <Accordion.Body>
                            <form className="AddUserForm">
                                <label>
                                    User Name:
                                    <input type="text" name="userName" />
                                </label>
                                <label>
                                    User Password:
                                    <input type="password" name="userPassword" />
                                </label>
                                <label>
                                    Department:
                                    <select>
                                        {allDepartments.map(dept => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.departmentName}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Role:
                                    <select>
                                        {allRoles.map(role => (
                                            <option key={role.id} value={role.rolename}>
                                                {role.rolename}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <button type="submit">Create User</button>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>    
        </div>
    )
}
export default AdminPanel;
