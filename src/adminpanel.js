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
    const [helpData, setHelpData] = useState([]);  // Состояние для хранения данных из API
    const [currentWindowHelpState, setCurrentWindowHelpState] = useState('');

    const rolesApi = 'http://192.168.101.226:5555/api/roles';
    const usersApi = 'http://192.168.101.226:5555/api/users';
    const departmentsApi = 'http://192.168.101.226:5555/api/departments';
    const processApi = 'http://192.168.101.226:5555/api/processes';
    const objectApi = 'http://192.168.101.226:5555/api/objects';

    // useEffect для загрузки данных при монтировании компонента
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Загрузка данных для выпадающих списков
                const responseDepartments = await axios.get(`${departmentsApi}/departments`, config);
                setAllDepartments(responseDepartments.data);

                const responseRoles = await axios.get(`${rolesApi}/roles`, config);
                setAllRoles(responseRoles.data);

                const responseProcesses = await axios.get(`${processApi}/processes`, config);
                setAllProcesses(responseProcesses.data);

                const responseObjects = await axios.get(`${objectApi}/objects`, config);
                setAllObjects(responseObjects.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);  // Пустой массив зависимостей означает, что этот эффект будет выполнен только один раз после монтирования компонента

    const handleAccordionClick = async (section) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            let data = [];
            setCurrentWindowHelpState(section)
            switch (section) {
                case 'departments':
                    const response = await axios.get(`${departmentsApi}/departments`, config);
                    data = response.data;
                    break;
                case 'processes':
                    const responseProcesses = await axios.get(`${processApi}/processes`, config);
                    data = responseProcesses.data;
                    break;
                case 'objects':
                    const responseObjects = await axios.get(`${objectApi}/objects`, config);
                    data = responseObjects.data;
                    break;
                case 'users':
                    const responseUsers = await axios.get(`${usersApi}/users`, config);
                    data = responseUsers.data;
                    break;
                case 'roles':
                    const responseRoles = await axios.get(`${rolesApi}/roles`, config);
                    data = responseRoles.data;
                    break;
                default:
                    break;
            }

            setHelpData(data); // Обновляем данные для отображения
            console.log(helpData);
            
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

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
        } catch (error) {
            console.error('Error creating department:', error);
        }
    };

    return(
        <div>
            <div className="help-window">
                {helpData.length > 0 ? (
                   <ul>
                   {helpData.map((item, index) => (
                       <li id={item.id} key={index}>
                           {Object.entries(item).map(([key, value]) => (
                               <div key={key}>
                                   <strong>{key}:</strong> {value}
                               </div>
                           ))}
                       </li>
                   ))}
               </ul>
                ) : (
                    <p>No data available</p>
                )}
            </div>
            <Container className="admin-panel">
                <h1>Admin Panel</h1>
                <Accordion defaultActiveKey={0}>
                    <Accordion.Item eventKey="0" >
                        <Accordion.Header onClick={() => handleAccordionClick('departments')}>Add Departments</Accordion.Header>
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
                        <Accordion.Header onClick={() => handleAccordionClick('processes')}>Add Process</Accordion.Header>
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
                        <Accordion.Header onClick={() => handleAccordionClick('objects')}>Add Object</Accordion.Header>
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
                        <Accordion.Header onClick={() => handleAccordionClick('users')}>Add User</Accordion.Header>
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
                                            <option key={role.id} value={role.id}>
                                                {role.roleName}
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
