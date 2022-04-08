import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./RegisterLogin.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    

    return (
        <div className="registerLoginBox">
            <h1>Login</h1>
            <p className="info">Login to access more options</p>

            <form onSubmit={ handleSubmit }>
                <div className="formRow">
                    <label>E-mail</label>
                    <input type="email" value={email} onChange={ (e) => setEmail(e.target.value) } placeholder="Enter your email" />
                </div><hr />

                <div className="formRow">
                    <label>Password</label>
                    <input type="password" value={password} onChange={ (e) => setPassword(e.target.value) } placeholder="Enter you password" />
                </div><hr />

                <div className="formRow">
                    <input type="submit" value="Login" />
                </div>
            </form>

            <p className="info tip">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}
 
export default Login;