import React from "react";
import "./Login.css"; 
import MyNavbar from './MyNavbar';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: false,
            error: null,
            username: "",
            password: "",
        }

    }

    render() {
        return(
            <div className="login-page">
                <MyNavbar />
                <div className="login-box-container center-content margin-top-small">
                    <h3>Welcome</h3>
                    <h4 className="margin-top-small">Login</h4>
                    <form className="login-form center-content margin-top-smaller">
                        <input className="login-input margin-top-smaller" type="text" placeholder="Username..." />
                        <input className="login-input margin-top-smaller" type="password" placeholder="Password..." />
                    </form>
                    <button className="my-button submit-button margin-top-smaller">Submit</button>
                    <div className="register-choice-container margin-top-small">
                        <div>First time here?</div>
                        <a href="/register">Create an account</a>
                    </div>
                
                </div>
            </div>
        )
    }

}

export default Login;