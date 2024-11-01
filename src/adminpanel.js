import React, { useEffect, useState } from "react"; 
import { Accordion, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './adminpanel.scss';
import axios from "axios";
import useAuth from "./isAuth";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const navigate = useNavigate('');

    const [allRoles, setAllRoles] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [allProcesses, setAllProcesses] = useState([]);
    const [allObjects, setAllObjects] = useState([]);
    const [allStatuses, setAllStatuses] = useState([]);

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
    const [newObjectType, setNewObjectType] = useState('');

    const [newStatusName, setNewStatusName] = useState('');
    const [newStatusDescription, setNewStatusDescription] = useState('');

    const [helpData, setHelpData] = useState([]);  
    const [currentWindowHelpState, setCurrentWindowHelpState] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Состояние для сообщений об успехе
    const { getAuthConfig } = useAuth();

    const rolesApi = 'http://localhost:5555/api/roles';
    const usersApi = 'http://localhost:5555/api/users';
    const departmentsApi = 'http://localhost:5555/api/departments';
    const processApi = 'http://localhost:5555/api/processes';
    const objectApi = 'http://localhost:5555/api/objects';
    const statusesApi = 'http://localhost:5555/api/statusses';

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

            const responseStatuses = await axios.get(`${statusesApi}/statuses`, config);
            setAllStatuses(responseStatuses.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
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
            setCurrentWindowHelpState(section);
            switch (section) {
                case 'departments':
                    const responseDepartments = await axios.get(`${departmentsApi}/departments`, config);
                    data = responseDepartments.data;
                    break;
                case 'processes':
                    const responseProcesses = await axios.get(`${processApi}/processes`, config);
                    data = responseProcesses.data;
                    break;
                case 'objects':
                    const responseObjects = await axios.get(`${objectApi}/objects`, config);
                    data = responseObjects.data;
                    break;
                case 'statuses':
                    const responseStatuses = await axios.get(`${statusesApi}/statuses`, config);
                    data = responseStatuses.data;
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
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
            const config = getAuthConfig();
            const response = await axios.post(`${departmentsApi}/newdepartment`, { departmentName: newDepartmentName }, config);
            setSuccessMessage(`Создан новый отдел: ${response.data.departmentName}`);
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
                departmentId: newProcessDepartment !== "" ? newProcessDepartment : null, // Если отдел не выбран, отправляем null
                dependencies: newProccessDependency.length > 0 ? newProccessDependency : [] // Если нет зависимостей, отправляем пустой массив
            }, config);
            fetchData()
            setSuccessMessage(`proccess created successfully ${response.data.name}`)
            console.log('Process created:', response.data);
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
                description: newObjectDescription,
                type: newObjectType
            }, config);
            setSuccessMessage(`Объект ${response.data.name} успешно создан!`);
            fetchData(); 
        } catch (error) {
            console.error('Ошибка при создании объекта:', error);
        }
    };

    const handleCreateStatus = async (e) => {
        e.preventDefault();
        try {
            const config = getAuthConfig();
            const response = await axios.post(`${statusesApi}/newstatus`, {
                statusName: newStatusName,
            }, config);
            setSuccessMessage(`Новый статус создан: ${response.data.statusName}`);
            fetchData();
        } catch (error) {
            console.error(`Ошибка при создании статуса: ${error}`);
            setSuccessMessage('Ошибка при создании статуса.');
        }
    };

    const handleDependencyChange = (e) => {
        const { options } = e.target;
        const selectedDependencies = [];
    
        // Проходим по всем вариантам и собираем зависимости, кроме "нет зависимости"
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected && options[i].value !== '') {
                selectedDependencies.push(parseInt(options[i].value));
            }
        }
    
        // Если выбран "нет зависимости", очищаем массив зависимостей
        if (selectedDependencies.length === 0) {
            setNewProcessDependency([]);
        } else {
            setNewProcessDependency(selectedDependencies);
        }
    };
    

    return (
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
                       <li key={index}>
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
        <option value={null}>Нет отдела</option> {/* Опция по умолчанию для "Нет отдела" */}
        {allDepartments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
        ))}
    </select>
</label>

                                <label>Зависимости:
    <select multiple onChange={handleDependencyChange}>
        <option value="">нет зависимости</option> {/* Опция для "нет зависимости" */}
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
                                    Тип:
                                    <input type="text" name="objectType" onChange={(e)=>setNewObjectType(e.target.value)} />
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
                    <Accordion.Item eventKey="4">
                        <Accordion.Header onClick={()=>{handleAccordionClick('statuses')}}>
                            Добавление Статуса
                        </Accordion.Header>
                        <Accordion.Body>
                            <form onSubmit={handleCreateStatus}>
                                <label>
                                    Название Статуса
                                    <input type="text" name="statusName" onChange={(e) => setNewStatusName(e.target.value)}/>
                                </label>
                                <label>
                                    Описание
                                    <input type="text" name="statusDescription" onChange={(e) => setNewStatusDescription(e.target.value)}/>
                                </label>
                                <button type="submit">create status</button>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>    
        </div>
    );
}

export default AdminPanel;
