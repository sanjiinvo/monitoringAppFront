import axios from "axios";
import useAuth from "../isAuth";

const mainApis = {
    rolesApi: 'http://localhost:5555/api/roles/roles',
    objectsApi: 'http://localhost:5555/api/objects/objects',
    usersApi: 'http://localhost:5555/api/users/users',
    departmentsApi: 'http://localhost:5555/api/departments',
    processApi: 'http://localhost:5555/api/processes'
};
 const {getAuthConfig} = useAuth()
 const authConfig = getAuthConfig()
const fetchSomeData = async (type) => {
    let data = null;

    try {
        switch (type) {
            case 'roles':
                data = await axios.get(mainApis.rolesApi, authConfig);
                break;
            case 'objects':
                data = await axios.get(mainApis.objectsApi, authConfig);
                break;
            case 'users':
                data = await axios.get(mainApis.usersApi, authConfig);
                break;
            case 'departments':
                data = await axios.get(mainApis.departmentsApi, authConfig);
                break;
            case 'processes':
                data = await axios.get(mainApis.processApi, authConfig);
                break;
            case 'all':
                const responseDepartments = await axios.get(mainApis.departmentsApi, authConfig);
                const responseRoles = await axios.get(mainApis.rolesApi, authConfig);
                const responseProcesses = await axios.get(mainApis.processApi, authConfig);
                const responseObjects = await axios.get(mainApis.objectsApi, authConfig);

                // Сбор всех данных в один объект
                data = {
                    departments: responseDepartments.data,
                    roles: responseRoles.data,
                    processes: responseProcesses.data,
                    objects: responseObjects.data,
                };
                break;
            default:
                throw new Error('Invalid type');
        }
        return data;
    } catch (error) {
        console.error(`Error fetching data for type ${type}: ${error.message}`);
        throw error;  // Бросаем ошибку дальше для обработки
    }
};

export default fetchSomeData;
