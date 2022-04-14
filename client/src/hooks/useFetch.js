import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (API_URL) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = async () => {
            try {
                const response = await axios.get(API_URL);
                console.log("response from useFetch file: ")
                console.log(response)
                console.log(response.data)
                setData(response.data);
                setIsPending(false);
            } catch (error) {
                setIsPending(false);
                setError(error.message)
            }
        };

        console.log("Fetching...")
        return unsubscribe;
    }, [API_URL]);
    
    return { data, isPending, error };
}
 
export default useFetch;