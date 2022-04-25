import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import GameList from "../../components/gamelist/GameList";
import useFetch from "../../hooks/useFetch";
import "./Games.css";
import Pending from "../../components/pending/Pending";

const Games = () => {
    const { data: games, isPending, error } = useFetch("/api/games/public/");

    if(error){
        console.log(error)
    }

    return (
        <div className="gameRatePages">
            <div className="gamesBtns">
                <Link className="btn" to="/submit">Submit a game <FontAwesomeIcon className="icon" icon={ faPlus } /></Link>
            </div>
            <h1>All games</h1>
            { error && !games && <span>{ error }</span> }
            { isPending && <Pending text={"Loading..."} /> }
            { games && <GameList games={ games } /> }
        </div>
    );
}
 
export default Games;