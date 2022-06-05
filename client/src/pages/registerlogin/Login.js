import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset  } from "../../redux/features/auth/authSlice";
import "./RegisterLogin.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();

        const userData = { email, password };

        dispatch(login(userData));
    }

    if(isLoading){
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="registerLoginBox">
            <h1>Login</h1>
            <p className="info">Login to access more options</p>

            <form onSubmit={ handleSubmit }>
                <div className="formRow">
                    <label>E-mail</label>
                    <input type="email" value={email} onChange={ (e) => setEmail(e.target.value) } placeholder="Enter your email" required />
                </div><hr />

                <div className="formRow">
                    <label>Password</label>
                    <input type="password" value={password} onChange={ (e) => setPassword(e.target.value) } placeholder="Enter you password" required />
                </div><hr />

                <div className="formRow">
                    <button type="submit">Login</button>
                </div>
            </form>

            <p className="info tip">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}
 
export default Login;