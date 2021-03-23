import React from "react";
import "./Register.css";
import MyNavbar from './MyNavbar';
import logo from './images/logo.png'
import {register, login, isLogged} from './api';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,    
            username: "",
            password: "",
            email: "",
            passwordConfirm: "",
            error: null,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                userId: response.data.id,
                logged: true,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                logged: false,
            })
        })
    }

    handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
            error: null,
        })
        console.log(name+": "+value)
    }

    handleSubmit = (event) => {
        if (this.state.username.length && this.state.password.length && this.state.passwordConfirm.length && this.state.email.length) {
            if (this.state.password === this.state.passwordConfirm) {
                var bodyFormData = new FormData();
                bodyFormData.append('username', this.state.username);
                bodyFormData.append('password', this.state.password);
                bodyFormData.append('confirmation', this.state.passwordConfirm);
                bodyFormData.append('email', this.state.email);
                register(bodyFormData)
                .then(response => {
                    console.log(response);
                    this.setState({
                        success: "Registered in successfully",
                    })
                    var body2 = new FormData();
                    body2.append('username', this.state.username);
                    body2.append('password', this.state.password);
                    login(body2)
                    .then(response => {
                        console.log(response);
                        this.setState({
                            success: "Registered in successfully"
                        })
                        let token = response.data.access
                        let refresh = response.data.refresh
                        console.log(token);
                        console.log(refresh);
                        localStorage.setItem('token', token)
                        localStorage.setItem('refresh', refresh)
                        setTimeout(() => {
                            window.location.href="/"
                        }, 1000)    
                    })
                    .catch(err => {
                        console.log(err);
                        console.log(err.status);
                        this.setState({
                            error: "Registration failed, try again."
                        })
                    })
                })
                .catch(err => {
                    console.log(err);
                    console.log(err.status);
                    this.setState({
                        error: "Username/email probably already exists."
                    })
                })  
            }
            else {
                this.setState({
                    error: "Passwords don't match"
                })
            }
        }
        else {
            this.setState({
                error: "Complete all fields"
            })
        }
        event.preventDefault();
    }

    render() {
        if (this.state.logged) {
            window.location.href = "/";
        }
        else {
            return(
                <div className="login-page">
                    <MyNavbar />
                    <div className="login-main-page flex-layout center-content">
                        <div classname="logo-container flex-item">
                                <img src={logo} alt="Jwitter logo"/>
                        </div>
                        <div className="login-box-container flex-item blur center-content margin-top-small">
                            <h3>Welcome</h3>
                            <h4 className="margin-top-small">Register</h4>
                            <div className="error-message">{this.state.error}</div>
                            {!this.state.error && this.state.success && (
                                <div className="success-message">{this.state.success}</div>
                            )}
                            <form className="login-form center-content margin-top-smaller">
                                <input className="login-input margin-top-smaller" type="text" name="username" value={this.state.username} placeholder="Username..."     onChange={this.handleInput}/>
                                <input className="login-input margin-top-smaller" type="email" name="email" value={this.state.email} placeholder="Email..."     onChange={this.handleInput}/>
                                <input className="login-input margin-top-smaller" type="password" name="password" value={this.state.password} placeholder="Password..." onChange={this.handleInput}/>
                                <input className="login-input margin-top-smaller" type="password" name="passwordConfirm" value={this.state.passwordConfirm} placeholder="Confirm Password..." onChange={this.handleInput}/>
                            </form>
                            <button className="my-button submit-button margin-top-smaller" onClick={this.handleSubmit}>Submit</button>
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
}

export default Register;