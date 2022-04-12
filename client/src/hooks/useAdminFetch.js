import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useAdminFetch = (API_URL) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    useEffect(() => {
        const unsubscribe = async () => {
            try {
                const response = await axios.get(API_URL, config);
                setData(response.data);
                setIsPending(false);
            } catch (error) {
                setIsPending(false);
                setError(error.message)
            }
        };

        return unsubscribe;
    }, [API_URL]);
    
    return { data, isPending, error };
}
 
export default useAdminFetch;