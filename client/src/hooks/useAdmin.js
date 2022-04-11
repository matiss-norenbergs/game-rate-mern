import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useSelector((state) => state.auth);
    let token;
    if(user){
       token = user.token;
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        const unsubscribe = async () => {
            try {
                const response = await axios.get("/api/users/isAdmin/", config);
                setIsAdmin(response.data);
                setIsPending(false);
            } catch (error) {
                setIsPending(false);
                setError(error.message)
            }
        };

        return unsubscribe;
    }, [user]);
    
    return { isAdmin, isPending, error };
}
 
export default useAdmin;