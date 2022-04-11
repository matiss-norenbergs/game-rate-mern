import { Link, Outlet } from "react-router-dom";
import "./Admin.css";

const Admin = () => {

    return (
        <div className="adminSection">
            <div className="adminNav">
                <h1>Admin panel</h1>

                <nav>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <Link to="/admin/games">Game list</Link>
                    <Link to="/admin/gametags">Game tag list</Link>
                </nav>
            </div>
            
            <div className="adminPage">
                <Outlet />
            </div>
        </div>

    );
}
 
export default Admin;