import React, { useState, useEffect } from "react";
import "./Login.css"; 
import MyNavbar from './MyNavbar';
import MobileNavbar from './MobileNavbar';
import logo from './images/logo.png' 
import {login, isLogged} from './api';
import Button from 'react-bootstrap/esm/Button';

function Login() {

    const [logged, setLogged] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1)

    useEffect(() => {
        isLogged()
        .then(response => {
            setLogged(true);
        })
        .catch(() => {
            setLogged(false);
        })
    }, [])

    const handleSubmit = (event) => {
        if (username.length && password.length) {
            var bodyFormData = new FormData();
            bodyFormData.append('username', username);
            bodyFormData.append('password', password);
            login(bodyFormData)
            .then(response => {
                setSuccess("Logged in successfully");
                localStorage.setItem('token', response.data.access)
                localStorage.setItem('refresh', response.data.refresh)
                setTimeout(() => { window.location.href="/" }, 500)
            })
            .catch(() => {
                setError("Login failed, try again.");
                setSuccess(null);
            })
        }
        else {
            setError("Complete both fields")
        }
        event.preventDefault();
    }
    
    const updateNavbarsColors = () => {
        setUpdateColorsBetweenNavbars(updateColorsBetweenNavbars+1);
    }

    if (logged) {
        window.location.href = "/";
    }

    else {
        return(
            <div className="login-page">
                { window.innerWidth<500 &&
                    <MobileNavbar updateColors={()=>{updateNavbarsColors();}} />
                }
                {window.innerWidth>=500 &&
                    <MyNavbar updateMyColors = {updateColorsBetweenNavbars} />
                }
                <div className="login-main-page flex-layout center-content">
                    <div className="logo-container flex-item">
                        <img src={logo} className="logo" alt="logo"/>
                    </div>
                    <div className="login-box-container flex-item blur center-content margin-top-small">
                        <h3>Welcome</h3>
                        <h4 className="margin-top-small">Login</h4>
                        <div className="error-message">{error}</div>
                        {!error && success && (
                            <div className="success-message">{success}</div>
                        )}
                        <form className="login-form center-content margin-top-smaller" onSubmit={handleSubmit}>
                            <div>
                                <input className="login-input margin-top-smaller" type="text"     name="username" value={username} placeholder="Username..." onChange={(event)=>{setUsername(event.target.value);setError(null);}}/>
                                <input className="login-input margin-top-smaller" type="password" name="password" value={password} placeholder="Password..." onChange={(event)=>{setPassword(event.target.value);setError(null);}}/>
                            </div>
                            <Button variant='primary' type='submit' className="submit-button margin-top-small" onClick={handleSubmit}>Submit</Button>
                        </form>
                        <div className="register-choice-container margin-top-small">
                            <div>First time here?</div>
                            <a href="/register">Create an account</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;