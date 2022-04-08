import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import "./NavBar.css";

const NavBar = () => {
    return (
        <div className="navBar">
            <Link to="/" className="navLogo">GameRate</Link>

            <nav>
                <Link to="/">Home</Link>
                <Link to="/games">Games</Link>
                <Link to="/profile">Profile</Link>
            </nav>

            <div className="navOptions">
                <Link to="/login">Login <FontAwesomeIcon icon={faRightToBracket} /></Link>
            </div>
        </div>
    );
}
 
export default NavBar;