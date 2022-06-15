import { Link } from "react-router-dom";
import StarRating from "../starrating/StarRating";
import "./GameCard.css";

function GameCard (props){
    const { _id, title, cover, rating } = props.data;

    return (
        <Link to={`/game/${_id}`} className="listedGame" style={{ backgroundImage: `url(${cover})` }}>
            <div className="listedGameInfo">
                <h2>{ title }</h2><hr />
                <StarRating rating={ rating } />
            </div>
        </Link>
    );
}

export default GameCard;