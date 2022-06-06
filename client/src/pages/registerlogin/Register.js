import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import validator from "validator";
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

        if(password !== password2 || password.length < 8 || password2.length < 8){
            alert("Passwords do not match or are too short!");
        }else{
            if(validator.isEmail(email)){
                const userData = { name, email, password }
                dispatch(register(userData));
            }else{
                alert("E-mail is invalid!");
            }
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
                    <input type="text" value={name} onChange={ (e) => setName(e.target.value) } minLength="4" placeholder="* Enter your username" required />
                    <h4 className="infoTip">Usernames display on reviews</h4>
                </div><hr />

                <div className="formRow">
                    <label>E-mail</label>
                    <input type="email" value={email} onChange={ (e) => setEmail(e.target.value) } placeholder="* Enter your email" required />
                    <h4 className="infoTip">Unique e-mail</h4>
                </div><hr />

                <div className="formRow">
                    <label>Password</label>
                    <input type="password" value={password} onChange={ (e) => setPassword(e.target.value) } placeholder="* Enter you password" required />
                    <h4 className="infoTip">8 characters min</h4>
                </div><hr />

                <div className="formRow">
                    <label>Password repeat</label>
                    <input type="password" value={password2} onChange={ (e) => setPassword2(e.target.value) } placeholder="* Repeat your password" required />
                    <h4 className="infoTip">8 characters min</h4>
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