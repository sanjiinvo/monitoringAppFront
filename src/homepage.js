import React, { useEffect, useState } from "react";
import useAuth from "./isAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () =>{


    const {getAuthConfig} = useAuth()

    const navigate = useNavigate('')

    const rolesApi = 'http://localhost:5555/api/roles';
    const usersApi = 'http://localhost:5555/api/users';
    const departmentsApi = 'http://localhost:5555/api/departments';
    const processApi = 'http://localhost:5555/api/processes';
    const objectApi = 'http://localhost:5555/api/objects';

    const [allRoles, setAllRoles] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [allProcesses, setAllProcesses] = useState([]);
    const [allObjects, setAllObjects] = useState([]);

    useEffect(()=>{
        fetchData()
    },[])



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
            console.log(`data set`);
            
        } catch (error) {
            console.error("Error fetching data:", error);
            if(error.response.status === 401){
                localStorage.removeItem('token')
                navigate('/login')
                console.log(`naviagtet to login failed with error: ${error}`);
                
            }
        }
    };

    return (
    <div>
        <h1>Welcome to the Home Page</h1>
        <div className="working_panel">
            <div className="working_panel_object_list">
                <h3>Object List:</h3>
                {allObjects.length > 0 ? (
                    <div>
                        {allObjects.map((item, index) => (
                            <div key={index} className="object_item">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div> 
                ) : (
                    <p>No objects on work</p>
                )}
            </div>
        </div>
    </div>
    )
}
export default HomePage;