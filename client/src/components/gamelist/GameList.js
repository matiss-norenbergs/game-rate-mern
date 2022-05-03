import { Link } from "react-router-dom";
import "./GameList.css";

const GameList = (props) => {
    const games = props.games;
    return (
        <div className="gameList">
            { games.map((game, index) => (
                <Link to={`/game/${game._id}`} className="listedGame" style={{ backgroundImage: `url(${game.cover})` }} key={ index }>
                    <div className="listedGameInfo">
                        <h2>{ game.title }</h2><hr />
                        <h3>Rating: { game.rating } <span>★</span></h3>
                    </div>
                </Link>
            )) }
        </div>
    );
}
 
export default GameList;