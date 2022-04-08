import axios from "axios";

const API_URL = "/api/games/";

//Submit new goal
const submitGame = async (gameData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, gameData, config);

    return response.data;
}

const gameService = {
    submitGame,
}

export default gameService;