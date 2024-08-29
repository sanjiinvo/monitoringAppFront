import React, { useState } from "react";
import "./login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {  // добавляем onLogin в качестве пропса
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(`Login: ${login}, Password: ${password}`);

    try {
      const response = await axios.post('http://192.168.101.226:5555/api/users/login', {
        username: login,
        password: password
      });

      const { token, username, rlname, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userrole', role);
      localStorage.setItem('realname', rlname);


      console.log('Token:', token);
      console.log('Username:', username);
      console.log('Role:', role);
      console.log('Realname:', rlname);
      

      if (token) {
        setErrorMessage('Authorized');
        onLogin();  // Вызов функции onLogin для обновления isAuthenticated в App
        navigate('/homepage');
      }
    } catch (err) {
      setErrorMessage('Login failed, please check login and password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-box">
        <h2>NAK</h2>
        <p>{errorMessage}</p>
        <label className="label-login-input">
          Login
          <input
            id="input-login"
            className="login-cont login-inp"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </label>
        <label className="label-password-input">
          Password
          <input
            id="input-password"
            type="text"
            className="login-cont password-inp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
