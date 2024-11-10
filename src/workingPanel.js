import { useEffect, useState } from "react";
import useAuth from "./isAuth";
import fetchSomeData from "./middlewares/fetchingdata";
import axios from "axios";

const WorkingPanel = () => {
    const [allObjects, setAllObjects] = useState([]);
    const [objectInfo, setObjectInfo] = useState(null)
    const {getAuthConfig} = useAuth(); // Хук вызывается здесь, в компоненте
    const config = getAuthConfig();


    const rolesApi = 'http://localhost:5555/api/roles';
    const usersApi = 'http://localhost:5555/api/users';
    const departmentsApi = 'http://localhost:5555/api/departments';
    const processApi = 'http://localhost:5555/api/processes';
    const objectApi = 'http://localhost:5555/api/objects';
    const statusesApi = 'http://localhost:5555/api/statusses';
    const mainProcessesApi = 'http://localhost:5555/api/mainprocesses'

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchSomeData('all', config);
            setAllObjects(data.objects);
            console.log(data);
            
            
        };
        fetchData();
        
    }, []);

    const getObjectInfo = async (objId) => {
        console.log(objId);
        
        try {
            const response = await axios.get(`${objectApi}/objectinfo/${objId}`, config);
            setObjectInfo(response.data); // Сохраняем информацию об объекте в состоянии
            console.log(`Информация об объекте ${objId}:`, response.data);
        } catch (error) {
            console.log("Ошибка при получении информации об объекте:", error);
        }
    };

    return (
        <div>
        <h2>Рабочая панель</h2>
        <div>
            <h3>Список объектов:</h3>
            {allObjects.map(obj => (
                <div 
                    key={obj.id}
                    onClick={() => getObjectInfo(obj.id)} // Передаем функцию в виде стрелки
                    style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ddd' }}
                >
                    {`${obj.name} : ${obj.id}`}
                </div>
            ))}
        </div>
        {objectInfo && ( // Отображаем информацию об объекте, если она получена
            <div>
                <h3>Информация об объекте:</h3>
                <p>Главные процессы:</p> {objectInfo.mainProcesses?.map(mprocess =>(
                    <div key={mprocess.id}>{mprocess.mainProcessName
} - Статус {mprocess.statusName}</div>
                ))}
                <h4>Процессы:</h4>
                {objectInfo.processes?.map(process => (
                    <div key={process.id}>{process.processName} - Статус: {process.statusName}</div>
                ))}
            </div>
        )}
    </div>
);
    
};

export default WorkingPanel;
