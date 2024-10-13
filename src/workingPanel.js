import { useEffect, useState } from "react";
import useAuth from "./isAuth";
import fetchSomeData from "./middlewares/fetchingdata";

const WorkingPanel = () => {
    const [allObjects, setAllObjects] = useState([]);
    const {getAuthConfig} = useAuth(); // Хук вызывается здесь, в компоненте
    const config = getAuthConfig();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchSomeData('all', config);
            setAllObjects(data.objects);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Working panel</h2>
            <div>objects: {allObjects.map(obj => (<div key={obj.id}>{obj.name}</div>))}</div>
        </div>
    );
};

export default WorkingPanel;
