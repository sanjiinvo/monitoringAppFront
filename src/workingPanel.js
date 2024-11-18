import { useEffect, useState } from "react";
import useAuth from "./isAuth";
import fetchSomeData from "./middlewares/fetchingdata";
import ObjectInfo from "./objectInfo";

const WorkingPanel = () => {
  const [allObjects, setAllObjects] = useState([]);
  const [selectedObjectIds, setSelectedObjectIds] = useState([]); // Список выбранных объектов
  const { getAuthConfig } = useAuth();
  const config = getAuthConfig();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSomeData('all', config);
      setAllObjects(data.objects);
      console.log(data);
    };
    fetchData();
  }, []);

  // Добавляем объект в список выбранных
  const handleObjectClick = (objId) => {
    if (!selectedObjectIds.includes(objId)) {
      setSelectedObjectIds([...selectedObjectIds, objId]);
    } else {
      // Если объект уже выбран, убираем его из списка (для переключения)
      setSelectedObjectIds(selectedObjectIds.filter(id => id !== objId));
    }
  };

  return (
    <div>
      <h2>Рабочая панель</h2>
      <div>
        <h3>Список объектов:</h3>
        {allObjects.map(obj => (
          <div key={obj.id} style={{ marginBottom: '10px' }}>
            <div
              onClick={() => handleObjectClick(obj.id)}
              style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ddd' }}
            >
              {`${obj.name} : ${obj.id}`}
            </div>
            
            {/* Отображаем информацию об объекте, если он выбран */}
            {selectedObjectIds.includes(obj.id) && (
              <ObjectInfo
                key={obj.id}
                objId={obj.id}
                config={config}
                onClose={() => handleObjectClick(obj.id)} // Используем handleObjectClick для закрытия
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingPanel;
