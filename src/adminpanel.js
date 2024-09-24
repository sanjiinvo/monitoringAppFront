import React, { useEffect, useState } from "react"; 
import { Accordion, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './adminpanel.scss';
import axios from "axios";
import useAuth from "./isAuth";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const navigate = useNavigate('')

    const [allRoles, setAllRoles] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [allProcesses, setAllProcesses] = useState([]);
    const [allObjects, setAllObjects] = useState([]);

    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserRealName, setNewUserRealNAme] = useState('');
    const [newUserPassword, setnewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState();
    const [newUserDepartment, setNewUserDepartment] = useState();

    const [newProccessName, setNewProcessName] = useState('');
    const [newProcessDescription, setNewProcessDescription] = useState('');
    const [newProccessWorkingTime, setNewProcessWorkingTime] = useState('');
    const [newProcessDepartment, setNewProcessDepartment] = useState();
    const [newProccessDependency, setNewProcessDependency] = useState([]);

    const [newObjectName, setNewObjectName] = useState('');
    const [newObjectDescription, setNewObjectDescription] = useState('');


    const [helpData, setHelpData] = useState([]);  
    const [currentWindowHelpState, setCurrentWindowHelpState] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Состояние для сообщений об успехе
    const {getAuthConfig} = useAuth();

    const rolesApi = 'http://localhost:5555/api/roles';
    const usersApi = 'http://localhost:5555/api/users';
    const departmentsApi = 'http://localhost:5555/api/departments';
    const processApi = 'http://localhost:5555/api/processes';
    const objectApi = 'http://localhost:5555/api/objects';

    // Функция для загрузки данных
    const fetchData = async () => {
        try {
            const config = getAuthConfig();
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
            if(error.code === 401){
                navigate('/login')
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccordionClick = async (section) => {
        try {
            const config = getAuthConfig();
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

            setHelpData(data); 
            console.log(helpData);
            
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
            const config = getAuthConfig();
            const response = await axios.post(`${departmentsApi}/newdepartment`, { departmentName: newDepartmentName }, config);
            console.log('Department created:', response.data);
            setSuccessMessage(`Создан новый отдел: ${response.data.departmentName}`); // Устанавливаем сообщение
            fetchData();
        } catch (error) {
            console.error('Error creating department:', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const config = getAuthConfig();
            const response = await axios.post(`${usersApi}/newuser`, { username: newUserName, password: newUserPassword, rlname: newUserRealName, roleId: newUserRole, departmentId: newUserDepartment }, config);
            console.log('User created:', response.data);
            setSuccessMessage(`Пользователь ${response.data.username} успешно создан!`);
            fetchData();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleCreateProcess = async (e) => {
        e.preventDefault();
        try {
            const config = getAuthConfig();
            const response = await axios.post(`${processApi}/newprocess`, {
                name: newProccessName, 
                description: newProcessDescription, 
                workingTime: newProccessWorkingTime, 
                departmentId: newProcessDepartment, 
                dependencies: newProccessDependency
            }, config);
            console.log('Process created:', response.data);
            setSuccessMessage(`Процесс ${response.data.name} успешно создан!`);
            fetchData();
        } catch (error) {
            console.error('Error creating process:', error);
        }
    };
    const handleCreateObject = async (e) => {
        e.preventDefault();
        try {
            const config = getAuthConfig();
            const response = await axios.post(`${objectApi}/newobject`, {
                name: newObjectName,
                description: newObjectDescription
            }, config);
            console.log('Object created:', response.data);
            setSuccessMessage(`Объект ${response.data.name} успешно создан!`);
            fetchData(); // Перезагружаем данные после создания
        } catch (error) {
            console.error('Ошибка при создании объекта:', error);
            setSuccessMessage('Ошибка при создании объекта.');
        }
    }
    

    const handleDependencyChange = (e) => {
        const { options } = e.target;
        const selectedDependencies = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedDependencies.push(parseInt(options[i].value));
            }
        }
        setNewProcessDependency(selectedDependencies);
    };

    return(
        <div>
            {successMessage && (
                <div className="popup-stats">
                    {successMessage}
                    <button onClick={() => setSuccessMessage('')}>Закрыть</button>
                </div>
            )}
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
                            <form className="AddProcessForm" onSubmit={handleCreateProcess}>
                                <label>Process Name:
                                    <input type="text" name="processName" onChange={(e) => setNewProcessName(e.target.value)} />
                                </label>
                                <label>Описание процесса:
                                    <input type="text" name="processDescription" onChange={(e) => setNewProcessDescription(e.target.value)} />
                                </label> 
                                <label>Время выполнения:
                                    <input placeholder="Дней" type="text" name="workingTime" onChange={(e) => setNewProcessWorkingTime(e.target.value)} />
                                </label>
                                <label>Отдел:
                                    <select onChange={(e) => setNewProcessDepartment(e.target.value)}>
                                        {allDepartments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Зависимости:
                                    <select multiple onChange={handleDependencyChange}>
                                        <option value="">None</option>
                                        {allProcesses.map(process => (
                                            <option key={process.id} value={process.id}>{process.name}</option>
                                        ))}
                                    </select>
                                </label> 
                                <button type="submit">Create Process</button>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header onClick={() => handleAccordionClick('objects')}>Add Object</Accordion.Header>
                        <Accordion.Body>
                            <form className="AddObjectForm" onSubmit={handleCreateObject}>
                                <label>Task Name:
                                    <input type="text" name="objectName" onChange={(e)=> setNewObjectName(e.target.value)} />
                                </label>
                                <label>
                                    Описание:
                                    <input type="text" name="objectDescription" onChange={(e)=>setNewObjectDescription(e.target.value)}/>
                                </label>
                                <label>
                                    <input/>
                                </label>
                                <button type="submit">Submit</button>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header onClick={() => handleAccordionClick('users')}>Add User</Accordion.Header>
                        <Accordion.Body>
                            <form className="AddUserForm" onSubmit={handleCreateUser}>
                                <label>
                                    User login:
                                    <input value={newUserName} type="text" name="userLogin" onChange={(e) => setNewUserName(e.target.value)} />
                                </label>
                                <label>
                                    User Real Name:
                                    <input type="text" name="userRealName" value={newUserRealName} onChange={(e) => setNewUserRealNAme(e.target.value)} />
                                </label>
                                <label>
                                    User Password:
                                    <input type="password" name="userPassword" value={newUserPassword} onChange={(e) => setnewUserPassword(e.target.value)} />
                                </label>
                                <label>
                                    Department:
                                    <select onChange={(e) => setNewUserDepartment(e.target.value)}>
                                        {allDepartments.map(dept => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.departmentName}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Role:
                                    <select onChange={(e) => setNewUserRole(e.target.value)}>
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
