import { Link } from "react-router-dom";
import GameList from "../../components/gamelist/GameList";
import useFetch from "../../hooks/useFetch";

const Games = () => {
    const { games, isPending, error } = useFetch("/api/games/");

    if(error){
        console.log(error)
    }

    return (
        <>
            <Link to="/submit">Submit a game</Link>
            <h1>All games</h1>
            { error && !games && <span>{ error }</span> }
            { isPending && <span>Loading...</span> }
            { games && <GameList games={ games } /> }
        </>
    );
}
 
export default Games;