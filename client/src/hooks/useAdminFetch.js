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
        axios.get(API_URL, config)
        .then(res => {
            setData(res.data);
            setIsPending(false)
        })
        .catch(err => {
            setError(err)
            setIsPending(false);
        })
    }, [API_URL]);
    
    return { data, isPending, error };
}
 
export default useAdminFetch;