import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import "./Game.css";

const Game = () => {
    const { id } = useParams();
    const { data: game, isPending, error } = useFetch(`/api/games/${id}`);

    return (
        <>
            { error && <div className="stateInfo"><FontAwesomeIcon className="icon" icon={faExclamationCircle} /> { error }</div> }
            { isPending && <div className="stateInfo">Loading... <FontAwesomeIcon className="icon loading" icon={faSpinner} /></div> }
            { game && isPending === false && error === null && (
                <div className="gameInfo">
                    <h1>{ game.title }</h1>

                    <div className="contents">
                        <img src={ game.cover } alt={ game.title } />
                        <p>{ game.summary }</p>
                    </div>
                </div>
            )}
        </>
    );
}
 
export default Game;