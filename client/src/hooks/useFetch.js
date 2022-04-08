import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (API_URL) => {
    const [games, setGames] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = async () => {
            try {
                const response = await axios.get(API_URL);
                setGames(response.data);
                setIsPending(false);
            } catch (error) {
                setIsPending(false);
                setError(error.message)
            }
        };

        return unsubscribe;
    }, []);
    
    return { games, isPending, error };
}
 
export default useFetch;