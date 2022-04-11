import { faAnglesLeft, faAnglesRight, faChartColumn, faGamepad, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import "./AdminNav.css";

const AdminNav = () => {
    const { isAdmin, isPending, error } = useAdmin();
    const navigate = useNavigate();
    const [displayNav, setDisplayNav] = useState("block");

    useEffect(() => {
        const redirectHome = () => {
            navigate("/");
        }

        if(!isPending && !isAdmin){
            return redirectHome()
        }
    }, [isAdmin, isPending]);

    function hideNavigation() {
        if(displayNav === "block"){
            setDisplayNav("none");
        }else{
            setDisplayNav("block");
        }
    }

    { isPending && <h1>Checking status...</h1> }
    if(!isPending && isAdmin){
        return (
            <div className="adminSection">
                <div className="navSection">
                    <button onClick={() => hideNavigation()} className="navSectionBtn">
                        { displayNav === "block" ? (
                            <FontAwesomeIcon icon={ faAnglesLeft } />
                        ) : (
                            <FontAwesomeIcon icon={ faAnglesRight } />
                        ) }
                    </button>
                    <div className="adminNav" style={{display: displayNav}}>
                        <Link to="/admin" className="adminNavHeader">Admin panel</Link>
        
                        <nav>
                            <Link to="dashboard">Dashboard <FontAwesomeIcon className="adminIcon" icon={ faChartColumn } /></Link>
                            <Link to="games">Game list <FontAwesomeIcon className="adminIcon" icon={ faGamepad } /></Link>
                            <Link to="tags">Tag list <FontAwesomeIcon className="adminIcon" icon={ faTags } /></Link>
                            <Link to="createtag">Create tag</Link>
                        </nav>
                    </div>
                </div>
                
                <div className="adminPage">
                    <Outlet />
                </div>
            </div>
    
        )
    }
}
 
export default AdminNav;