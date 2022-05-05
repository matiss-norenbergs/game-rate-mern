import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faFillDrip, faRightFromBracket, faRightToBracket, faUserAlt, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../redux/features/auth/authSlice";
import "./NavBar.css";
import { useState } from "react";

const NavBar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const currentMode = localStorage.getItem("gamerate-mode");
    const [mode, setMode] = useState(currentMode ? currentMode : "dark");

    const modes = {
        dark: { bg: "#222", tpBlack: "rgba(0, 0, 0, 0.4)", text1: "#fff", text2: "#ddd" },
        light: { bg: "#fff", tpBlack: "rgba(0, 0, 0, 0.15)", text1: "#000", text2: "#222" }
    };

    function setColors (mode, val){
        const setStyling = document.documentElement.style;

        setStyling.setProperty('--background', mode.bg);
        setStyling.setProperty('--transparent-black', mode.tpBlack);
        setStyling.setProperty('--white', mode.text1);
        setStyling.setProperty('--white2', mode.text2);

        val && localStorage.setItem("gamerate-mode", val);
    }

    if(currentMode){
        currentMode === "dark" ? setColors(modes.dark) : setColors(modes.light)
    }

    const changeMode = () => {
        if(mode === "dark"){
            setMode("light");
            setColors(modes.light, "light");
        }else{
            setMode("dark");
            setColors(modes.dark, "dark");
        }
    }

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        window.location.reload(false);
    }

    return (
        <>
            <div className="navBar">
                <Link to="/" className="navLogo">GameRate</Link>

                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/games">Games</Link>
                    { user && <Link to="/profile">Profile</Link> }
                    { user && user.role === "admin" && <Link to="/admin">Admin dashboard</Link> }
                </nav>

                <div className="navOptions">
                    { !user ? (
                        <button className="optionBtn" style={{ fontSize: "1.8rem" }}><FontAwesomeIcon icon={faBars} /></button>
                    ) : (
                        <button className="optionBtn"><FontAwesomeIcon icon={faUserAlt} /> { user.name }</button>
                    )}

                    <div className="options">
                        <Link className="option mobile" to="/">Home</Link>
                        <Link className="option mobile" to="/games">Games</Link>
                        { user && <Link className="option mobile" to="/profile">Profile</Link> }
                        { user && user.role === "admin" && <Link className="option mobile" to="/admin">Admin dashboard</Link> }

                        { !user ? (
                            <>
                                <Link className="option" to="/login">Login <FontAwesomeIcon icon={faRightToBracket} /></Link>
                                <Link className="option" to="/register">Register <FontAwesomeIcon icon={faUserPen} /></Link>
                            </>
                        ) : (
                            <button className="option" onClick={ handleLogout }>Logout <FontAwesomeIcon icon={faRightFromBracket} /></button>
                        )}

                        <button className="option" onClick={ changeMode }>Mode: { mode } <FontAwesomeIcon icon={faFillDrip} /></button>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default NavBar;