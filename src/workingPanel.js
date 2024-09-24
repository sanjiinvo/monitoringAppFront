import { useEffect, useState } from "react"
import useAuth from "./isAuth"


const WorkingPanel = () =>{



    const [allRoles, setAllRoles] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [allProcesses, setAllProcesses] = useState([]);
    const [allObjects, setAllObjects] = useState([]);
    const {getAuthConfig} = useAuth()
    const config = getAuthConfig()


    const fetchSomeData = async (type)=>{
        try {
            const data = await fetchSomeData(config, 'all')
        } catch (error) {
            
        }
    }


    useEffect(()=>{
        fetchSomeData('objects')
        
    },[])



    return(
        <div>
            <h2>
                Working panel
            </h2>
            <div>
                objects:
                {}
            </div>
        </div>
    )
}

export default WorkingPanel