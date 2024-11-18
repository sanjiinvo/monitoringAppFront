// components/ObjectInfo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ObjectInfo = ({ objId, config, onClose }) => {
  const [objectInfo, setObjectInfo] = useState(null);

  useEffect(() => {
    const getObjectInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/api/objects/objectinfo/${objId}`, config);
        setObjectInfo(response.data);
        console.log(`Информация об объекте ${objId}:`, response.data);
      } catch (error) {
        console.error("Ошибка при получении информации об объекте:", error);
      }
    };

    getObjectInfo();
  }, [objId, config]);

  const updateMainProcessStatus = async (mainprocId) => {
    console.log("Updating status for mainProcessId:", mainprocId, "ObjectId:", objId);

    try {
      const response = await axios.patch(
        `http://localhost:5555/api/objects/${objId}/process/status`,
        { objectId: objId, mainProcessId: mainprocId, newStatusId: 2 }, 
        config
      );

      // Обновляем состояние при успешном ответе
      if (response.status === 200) {
        setObjectInfo(prev => ({
          ...prev,
          mainProcesses: prev.mainProcesses.map(proc =>
            proc.mainProcessId === mainprocId
              ? { ...proc, statusId: 2, statusName: 'Начат' }  // Обновляем статус и ID на фронте
              : proc
          )
        }));
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса главного процесса:", error);
    }
  };

  if (!objectInfo) return <p>Загрузка информации...</p>;

  return (
    <div key={objId} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
      <button onClick={() => onClose(objId)}>Закрыть</button>
      <h3>Информация об объекте {objId}:</h3>
      <p>Главные процессы:</p>
      {objectInfo.mainProcesses?.map(mprocess => (
        <div key={mprocess.mainProcessId} style={{ marginBottom: '8px' }}>
          {mprocess.mainProcessName} - Статус {mprocess.statusName}

          {/* Рендерим кнопку "Начать Процесс" только если статус "не начат" */}
          {mprocess.statusId === 1 ? (
            <button onClick={() => updateMainProcessStatus(mprocess.mainProcessId)}>
              Начать Процесс
            </button>
          ) : null}
        </div>
      ))}
      <h4>Процессы:</h4>
      {objectInfo.processes?.map(process => (
        <div key={process.id}>
          {process.processName} - Статус: {process.statusName}
        </div>
      ))}
    </div>
  );
};

export default ObjectInfo;
