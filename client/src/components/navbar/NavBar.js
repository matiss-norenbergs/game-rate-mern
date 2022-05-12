import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChartColumn, faFillDrip, faGamepad, faHouse, faRightFromBracket, faRightToBracket, faUserAlt, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../redux/features/auth/authSlice";
import "./NavBar.css";

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
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/news">News</NavLink>
                    <NavLink to="/games">Games</NavLink>
                    { user && <NavLink to="/profile">Profile</NavLink> }
                    { user && user.role === "admin" && <NavLink to="/admin">Admin dashboard</NavLink> }
                </nav>

                <div className="navOptions">
                    { !user ? (
                        <button className="optionBtn" style={{ fontSize: "1.8rem" }}><FontAwesomeIcon icon={ faBars } /></button>
                    ) : (
                        <button className="optionBtn"><FontAwesomeIcon icon={ faUserAlt } /> { user.name }</button>
                    )}

                    <div className="options">
                        <NavLink className="option mobile" to="/">Home <FontAwesomeIcon icon={ faHouse } /></NavLink>
                        <NavLink className="option mobile" to="/games">Games <FontAwesomeIcon icon={ faGamepad } /></NavLink>

                        { user &&
                            <NavLink className="option mobile" to="/profile">
                                Profile
                                <FontAwesomeIcon icon={ faUserAlt } />
                            </NavLink>
                        }
                        { user && user.role === "admin" &&
                            <NavLink className="option mobile" to="/admin">
                                Admin dashboard
                                <FontAwesomeIcon icon={ faChartColumn } />
                            </NavLink>
                        }

                        { !user ? (
                            <>
                                <NavLink className="option" to="/login">Login <FontAwesomeIcon icon={ faRightToBracket } /></NavLink>
                                <NavLink className="option" to="/register">Register <FontAwesomeIcon icon={ faUserPen } /></NavLink>
                            </>
                        ) : (
                            <button className="option" onClick={ handleLogout }>Logout <FontAwesomeIcon icon={ faRightFromBracket } /></button>
                        )}

                        <button className="option" onClick={ changeMode }>Mode: { mode } <FontAwesomeIcon icon={ faFillDrip } /></button>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default NavBar;