import { Link } from "react-router-dom";
import "./Game.css";

function Game (props){
    const { _id, title, cover, rating } = props.data;

    return (
        <Link to={`/game/${_id}`} className="listedGame" style={{ backgroundImage: `url(${cover})` }}>
            <div className="listedGameInfo">
                <h2>{ title }</h2><hr />
                <h3>Rating: { rating } <span>★</span></h3>
            </div>
        </Link>
    );
}

export default Game;