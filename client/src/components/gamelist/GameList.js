import { Link } from "react-router-dom";
import "./GameList.css";

const GameList = (props) => {
    const games = props.games;
    return (
        <div className="gameList">
            { games.map((game) => (
                <Link to={`/game/${game._id}`} className="listedGame" style={{ backgroundImage: `url(${game.cover})` }} key={ game._id }>
                    <div className="listedGameInfo">
                        <h2>{ game.title }</h2>
                    </div>
                </Link>
            )) }
        </div>
    );
}
 
export default GameList;