import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import "./Admin.css";

const Admin = () => {
    const { isAdmin, isPending, error } = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        const redirectHome = () => {
            navigate("/");
        }

        if(!isPending && !isAdmin){
            return redirectHome()
        }
    }, [isAdmin, isPending])

    { isPending && <h1>Checking status...</h1> }
    if(!isPending && isAdmin){
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
    
        )
    }
}
 
export default Admin;