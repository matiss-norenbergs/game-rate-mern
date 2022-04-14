import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (API_URL) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
        console.log("Fetching... url: " + API_URL)

        axios.get(API_URL)
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
 
export default useFetch;