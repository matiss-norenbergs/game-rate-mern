import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../redux/features/auth/authSlice";
import "./NavBar.css";

const NavBar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

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
                </nav>

                <div className="navOptions">
                    { !user ? (
                            <Link className="optionBtn" to="/login">Login <FontAwesomeIcon icon={faRightToBracket} /></Link>
                    ) : (
                        <>
                            <div className="loggedUser" onClick={ handleLogout }><FontAwesomeIcon icon={faUserAlt} /> { user.name }</div>
                        </>
                    ) }
                </div>
            </div>
        </>
    );
}
 
export default NavBar;