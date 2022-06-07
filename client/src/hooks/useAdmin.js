import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if(user){
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            axios.get("/api/users/isAdmin/", config)
            .then(res => {
                setIsAdmin(res.data);
                setIsPending(false)
            })
            .catch(err => {
                setError(err)
                setIsPending(false);
            })
        }else{
            navigate("/");
        }
    }, [user, navigate]);
    
    return { isAdmin, isPending, error };
}
 
export default useAdmin;