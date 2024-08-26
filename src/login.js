import React, { useEffect, useState } from "react";
import "./login.scss";
import axios from "axios";
const Login =() =>{
    let users2 = [];

    const [login, setlogin] = useState('')
    const [password, setpassword] =useState('')
    const [errormessage, setErrormessage] = useState('')
    const handlelogin = (e)=>{
        e.preventDefault()
        console.log(`Login: ${login}, Password: ${password}`)
        
        LoginFunc()
    }

    const LoginFunc = async ()  =>{
        try {
            const responce = axios.post ('http://localhost:5555/api/users/login',{
                username: login,
                password: password
            })

            const token = (await responce).data.token
            localStorage.setItem('token', token)
            
            
        } catch (err) {
         setErrormessage('login failed, please check login and password')   
        }
    }
    

    return(
        <div className="login-container">
            <form onSubmit={handlelogin} className="login-box">
                <h2>NAK</h2>
                <p>{errormessage}</p>
                <label className="label-login-input">
                    Login
                <input id="input-login" className="login-cont login-inp"
                value={login}
                onChange={(e)=> setlogin(e.target.value)}/>
                </label>
                <label className="label-password-input">
                    Password
                <input id="input-password" className="login-cont password-inp"
                value={password}
                onChange={(e)=> setpassword(e.target.value)}/>
                </label>
                <button type="submit"> Login</button>

            </form>
        </div>
    )
}

export default Login;