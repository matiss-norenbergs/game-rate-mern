import { faAnglesLeft, faAnglesRight, faChartColumn, faFileCirclePlus, faGamepad, faNewspaper, faTag, faTags, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Pending from "../../components/pending/Pending";
import useAdmin from "../../hooks/useAdmin";
import "./AdminNav.css";

const AdminNav = () => {
    const { isAdmin, isPending, error } = useAdmin();
    const navigate = useNavigate();
    const adminNav = localStorage.getItem("gamerate-admin-nav");
    const [displayNav, setDisplayNav] = useState(adminNav ? adminNav : "inline");

    useEffect(() => {
        const redirectHome = () => {
            navigate("/");
        }

        if(!isPending && !isAdmin){
            return redirectHome();
        }
    }, [isAdmin, isPending, navigate]);

    function hideNavigation() {
        if(displayNav === "inline"){
            setDisplayNav("none");
            localStorage.setItem("gamerate-admin-nav", "none");
        }else{
            setDisplayNav("inline");
            localStorage.removeItem("gamerate-admin-nav");
        }
    }

    const resizeNav = () => {
        if(displayNav === "inline"){
            return { fontSize: "1.4rem", width: "1.6rem" }
        }else{
            return { fontSize: "1.8rem", width: "auto", marginRight: "0" }
        }
    }

    { !isPending && error && console.log(error) }
    { isPending && <Pending text={"Checking status..."} center={true} size={"2rem"} /> }
    if(!isPending && isAdmin === true){
        return (
            <div className="adminSection">
                <div className="navSection">
                    <button onClick={() => hideNavigation()} className="navSectionBtn">
                        { displayNav === "inline" ? (
                            <FontAwesomeIcon icon={ faAnglesLeft } />
                        ) : (
                            <FontAwesomeIcon icon={ faAnglesRight } />
                        ) }
                    </button>
                    <div className="adminNav" style={{ padding: displayNav === "inline" ? ".8rem 1.4rem" : ".8rem .8rem" }}>
                        <Link to="/admin/dashboard" className="adminNavHeader" style={{ display: displayNav }}>Admin panel</Link>
        
                        <nav>
                            <NavLink to="dashboard">
                                <FontAwesomeIcon className="adminIcon" style={ resizeNav() } icon={ faChartColumn } />
                                <span style={{ display: displayNav }}>Dashboard</span>
                            </NavLink>

                            <NavLink to="games">
                                <FontAwesomeIcon className="adminIcon" style={ resizeNav() } icon={ faGamepad } />
                                <span style={{ display: displayNav }}>Game list</span>
                            </NavLink>

                            <NavLink to="tags">
                                <FontAwesomeIcon className="adminIcon" style={ resizeNav() } icon={ faTags } />
                                <span style={{ display: displayNav }}>Tag list</span>
                            </NavLink>

                            <NavLink to="tag/create">
                                <FontAwesomeIcon className="adminIcon" style={ resizeNav() } icon={ faTag } />
                                <span style={{ display: displayNav }}>Create tag</span>    
                            </NavLink>

                            <NavLink to="posts">
                                <FontAwesomeIcon className="adminIcon" style={ resizeNav() } icon={ faNewspaper } />
                                <span style={{ display: displayNav }}>News posts</span>    
                            </NavLink>

                            <NavLink to="post/create">
                                <FontAwesomeIcon className="adminIcon" style={ resizeNav() } icon={ faFileCirclePlus } />
                                <span style={{ display: displayNav }}>Create post</span>
                            </NavLink>

                            <NavLink to="users">
                                <FontAwesomeIcon className="adminIcon" style={ resizeNav() } icon={ faUsers } />
                                <span style={{ display: displayNav }}>User list</span>
                            </NavLink>
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