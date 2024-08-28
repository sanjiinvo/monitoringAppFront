import { useEffect, useState } from 'react';
import AdminPanel from './adminpanel';
import './App.scss';
import Login from './login';
import { Navigate, Route, Routes } from 'react-router-dom';
import MenuBar from './navbar';
import HomePage from './homepage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
    }
  },[])
  return (
    <>
      {isAuthenticated && <MenuBar />}
      <Routes>
        {!isAuthenticated ? (
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </>
        )}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;
