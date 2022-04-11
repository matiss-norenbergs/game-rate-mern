import { Link } from "react-router-dom";
import "./NewGames.css";

const NewGames = (props) => {
    const games = props.games;

    const formatPostTime = (datePosted) => {
        const moment = require("moment");
        let timePosted = moment(datePosted).fromNow();
        return timePosted;
    }

    return (
        <div className="newGames">
            {games.map((game) => (
                <Link to={`/game/${game._id}`} key={ game._id } className="gameCard">
                    <img src={ game.cover } alt={ game.title } />
                    <div className="textContents">
                        <h2 className="gameTitle">{ game.title }</h2>
                        <span className="gamePublished">{ formatPostTime(game.updatedAt) }</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
 
export default NewGames;