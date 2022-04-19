import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, reset  } from "../../redux/features/auth/authSlice";
import "./RegisterLogin.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if(isError){
            alert(message);
        }

        if(isSuccess || user){
            navigate("/");
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(password !== password2){
            alert("Passwords do not match")
        }else{
            const userData = { name, email, password }

            dispatch(register(userData));
        }
    }
    
    if(isLoading){
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="registerLoginBox">
            <h1>Register</h1>
            <p className="info">Create an account to access more options</p>

            <form onSubmit={ handleSubmit }>
                <div className="formRow">
                    <label>Username</label>
                    <input type="text" value={name} onChange={ (e) => setName(e.target.value) } placeholder="* Enter your username" />
                </div><hr />

                <div className="formRow">
                    <label>E-mail</label>
                    <input type="email" value={email} onChange={ (e) => setEmail(e.target.value) } placeholder="* Enter your email" />
                </div><hr />

                <div className="formRow">
                    <label>Password</label>
                    <input type="password" value={password} onChange={ (e) => setPassword(e.target.value) } placeholder="* Enter you password" />
                </div><hr />

                <div className="formRow">
                    <label>Password repeat</label>
                    <input type="password" value={password2} onChange={ (e) => setPassword2(e.target.value) } placeholder="* Enter your password again" />
                </div><hr />

                <div className="formRow">
                    <button type="submit">Register</button>
                </div>
            </form>

            <p className="info tip">Have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}
 
export default Register;