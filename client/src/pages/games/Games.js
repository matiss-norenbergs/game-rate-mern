import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import GameList from "../../components/gamelist/GameList";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";
import "./Games.css";

const Games = () => {
    const [field, setField] = useState("publishedAt");
    const [order, setOrder] = useState(-1);
    const { data: games, isPending, error } = useFetch(`/api/games/public/${field}/${order}`);

    return (
        <div className="gameRatePages">
            <div className="gamesBtns">
                {/* <button className="btn">Filter</button> */}
                <Link className="btn" to="/submit">Submit a game <FontAwesomeIcon className="icon" icon={ faPlus } /></Link>
            </div>

            <div className="gameFilter">
                <label>Sort by: </label>
                <select value={ field } onChange={ (e) => setField(e.target.value) }>
                    <option value="publishedAt">Publishing date</option>
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                </select>

                <label>Order: </label>
                <select value={ order } onChange={ (e) => setOrder(e.target.value) }>
                    <option value={-1}>Descending &#8595;</option>
                    <option value={1}>Ascending &#8593;</option>
                </select>
            </div>

            <h1>All published games</h1>
            { error && !games && <span>{ error }</span> }
            { isPending && <Pending text={"Loading..."} /> }
            { games && <GameList games={ games } /> }
        </div>
    );
}
 
export default Games;