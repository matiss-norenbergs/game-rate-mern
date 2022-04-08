import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./RegisterLogin.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    

    return (
        <div className="registerLoginBox">
            <h1>Register</h1>
            <p className="info">Create an account to access more options</p>

            <form onSubmit={ handleSubmit }>
                <div className="formRow">
                    <label>Username</label>
                    <input type="text" value={name} onChange={ (e) => setName(e.target.value) } placeholder="Enter your username" />
                </div><hr />

                <div className="formRow">
                    <label>E-mail</label>
                    <input type="email" value={email} onChange={ (e) => setEmail(e.target.value) } placeholder="Enter your email" />
                </div><hr />

                <div className="formRow">
                    <label>Password</label>
                    <input type="password" value={password} onChange={ (e) => setPassword(e.target.value) } placeholder="Enter you password" />
                </div><hr />

                <div className="formRow">
                    <label>Password repeat</label>
                    <input type="password" value={password2} onChange={ (e) => setPassword2(e.target.value) } placeholder="Enter your password again" />
                </div><hr />

                <div className="formRow">
                    <input type="submit" value="Register" />
                </div>
            </form>

            <p className="info tip">Have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}
 
export default Register;