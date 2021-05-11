import React from "react";
import "./Login.css"; 
import MyNavbar from './MyNavbar';
import MobileNavbar from './MobileNavbar';
import logo from './images/logo.png' 
import {login, isLogged} from './api';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
            error: null,
            success: null,
            username: "",
            password: "",
            updateColorsBetweenNavbars: 1,
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateNavbarsColors = this.updateNavbarsColors.bind(this);
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
        if (this.state.username.length && this.state.password.length) {
            var bodyFormData = new FormData();
            bodyFormData.append('username', this.state.username);
            bodyFormData.append('password', this.state.password);
            //bodyFormData.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE2NDEzNzk4LCJqdGkiOiJjMTZhNzgzYWZkMGY0YzM1OTc3ZDk3YWM1NmQ4MzJkMiIsInVzZXJfaWQiOjZ9.o19RoJwXNtk9Aouwbot8Tb5LOk_f1_wCW8pRan1x8oU');
            login(bodyFormData)
            .then(response => {
                console.log(response);
                this.setState({
                    success: "Logged in successfully",
                })
                let token = response.data.access
                let refresh = response.data.refresh
                localStorage.setItem('token', token)
                localStorage.setItem('refresh', refresh)
                setTimeout(() => {
                    window.location.href="/"
                }, 500)
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: "Login failed, try again."
                })
            })
        }
        else {
            this.setState({
                error: "Complete both fields"
            })
        }
        event.preventDefault();
    }
    updateNavbarsColors = () => {
        this.setState({
            updateColorsBetweenNavbars: this.state.updateColorsBetweenNavbars+1,
        })
    }
    render() {
        if (this.state.logged) {
            window.location.href = "/";
        }
        else {
            return(
                <div className="login-page">
                    { window.innerWidth<500 &&
                        <MobileNavbar updateColors={()=>{this.updateNavbarsColors();}} />
                    }
                    {window.innerWidth>=500 &&
                        <MyNavbar updateMyColors = {this.state.updateColorsBetweenNavbars} />
                    }
                    <div className="login-main-page flex-layout center-content">
                        <div className="logo-container flex-item">
                            <img src={logo} className="logo" alt="Jwitter logo"/>
                        </div>
                        <div className="login-box-container flex-item blur center-content margin-top-small">
                            <h3>Welcome</h3>
                            <h4 className="margin-top-small">Login</h4>
                            <div className="error-message">{this.state.error}</div>
                            {!this.state.error && this.state.success && (
                                <div className="success-message">{this.state.success}</div>
                            )}
                            <form className="login-form center-content margin-top-smaller" onSubmit={this.handleSubmit}>
                                <div>
                                    <input className="login-input margin-top-smaller" type="text" name="username" value={this.state.username} placeholder="Username..."     onChange={this.handleInput}/>
                                    <input className="login-input margin-top-smaller" type="password" name="password" value={this.state.password} placeholder="Password..." onChange={this.handleInput}/>
                                </div>
                                <button className="my-button submit-button margin-top-smaller" onClick={this.handleSubmit}>Submit</button>
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
}

export default Login;