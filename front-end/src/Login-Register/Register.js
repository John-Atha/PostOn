import React, { useState, useEffect } from "react";
import "./Login.css";
import MyNavbar from '../MyNavbar';
import MobileNavbar from '../MobileNavbar';
import logo from '../images/logo.png'
import {register, login, isLogged} from '../api';
import Button from 'react-bootstrap/esm/Button';

function Register() {
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [updateColorsBetweenNavbars, setUpdateColorsBetweenNavbars] = useState(1);


    const validateUsername = (str) => {
        let allowed = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 
                       'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
                       'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                       'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', '.', '1', '2',
                       '3', '4', '5', '6', '7', '8', '9']
        if (!allowed.includes(str.charAt(str.length-1)) || !str.length) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        isLogged()
        .then(() => {
            setLogged(true);
        })
        .catch(() => {
            setLogged(false);
        })
    }, [])

    const handleUsername = (event) => {
        const value = event.target.value;
        if (!validateUsername(value)) {
            setError("Username can contain only letters, '.' and '_'.");
        }
        else if (value.length>13) {
            setError("Username should be less than 14 characters");
        }
        else {
            setUsername(event.target.value);
            setError(null);
        } 
    }

    const loginAfterRegister = () => {
        let body = new FormData();
        body.append('username', username);
        body.append('password', password);
        login(body)
        .then(response => {
            setSuccess("Registered in successfully");
            localStorage.setItem('token', response.data.access)
            localStorage.setItem('refresh', response.data.refresh)
            setTimeout(() => { window.location.href="/" }, 500)    
        })
        .catch(err => {
            setError("Registration failed, try again.");
        })
    }

    const handleSubmit = (event) => {
        if (username.length && password.length && confirmation.length && email.length) {
            if (password === confirmation) {
                var bodyFormData = new FormData();
                bodyFormData.append('username', username);
                bodyFormData.append('password', password);
                bodyFormData.append('confirmation', confirmation);
                bodyFormData.append('email', email);
                register(bodyFormData)
                .then(() => {
                    setSuccess("Registered in successfully");
                    loginAfterRegister();
                })
                .catch(err => {
                    setError("Username/email probably already exists.");
                })  
            }
            else {
                setError("Passwords don't match");
            }
        }
        else {
            setError("Complete all fields")
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
                        <h4 className="margin-top-small">Register</h4>
                        <div className="error-message">{error}</div>
                        {!error && success && (
                            <div className="success-message">{success}</div>
                        )}
                        <form className="login-form center-content margin-top-smaller" onSubmit={handleSubmit}>
                            <div>
                                <input id="username" className="login-input margin-top-smaller" type="text"     name="username"     value={username}     placeholder="Username..."         onChange={handleUsername}/>
                                <input               className="login-input margin-top-smaller" type="email"    name="email"        value={email}        placeholder="Email..."            onChange={(event)=>{setEmail(event.target.value);        setError(null);}}/>
                                <input               className="login-input margin-top-smaller" type="password" name="password"     value={password}     placeholder="Password..."         onChange={(event)=>{setPassword(event.target.value);     setError(null);}}/>
                                <input               className="login-input margin-top-smaller" type="password" name="confirmation" value={confirmation} placeholder="Confirm Password..." onChange={(event)=>{setConfirmation(event.target.value); setError(null);}}/>
                            </div>
                            <Button variant='primary' className="submit-button margin-top-small" onClick={handleSubmit}>Submit</Button>
                        </form>
                        <div className="register-choice-container margin-top-small">
                            <div>Already have an account?</div>
                            <a href="/login">Log in</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;