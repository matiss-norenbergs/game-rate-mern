import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if(!user){
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <>
            <h1>Profile</h1>
        </>
    );
}
 
export default Profile;