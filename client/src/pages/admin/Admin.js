import { Link, Outlet } from "react-router-dom";
import "./Admin.css";

const Admin = () => {

    return (
        <div className="adminSection">
            <div className="adminNav">
                <Link to="/admin" className="adminNavHeader">Admin panel</Link>

                <nav>
                    <Link to="dashboard">Dashboard</Link>
                    <Link to="games">Game list</Link>
                    <Link to="gametags">Game tag list</Link>
                </nav>
            </div>
            
            <div className="adminPage">
                <Outlet />
            </div>
        </div>

    );
}
 
export default Admin;