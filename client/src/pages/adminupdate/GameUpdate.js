import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const GameUpdate = () => {
    const { id } = useParams();
    const { data: game, isPending, error } = useFetch(`/api/games/${id}`);
    const [title, setTitle] = useState("");
    const [cover, setCover] = useState("");
    const [summary, setSummary] = useState("");
    const [trailer, setTrailer] = useState("");
    const [publicVisible, setPublicVisible] = useState(false);
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const gameData = { title, cover, summary, trailer, publicVisible };
        const response = await axios.put(`/api/games/${id}`, gameData, config);
        console.log(response);
        navigate("/admin/games");
    }

    useEffect(() => {
        if(game){
            setTitle(game.title);
            setCover(game.cover);
            setSummary(game.summary);
            setTrailer(game.trailer);
            setPublicVisible(game.publicVisible);
        }
    }, [game]);

    return (
        <>
            { !isPending && game && (
                <div className="formPage">
                    <h1>Selected game: { game.title }</h1>

                    <div className="formData">
                        <div className="formImage">
                            { cover && <img src={ cover } alt={ game.title } /> }
                        </div>

                        <form onSubmit={ handleSubmit }>
                            <label>Title:</label>
                            <input type="text" value={ title } onChange={ (e) => setTitle(e.target.value) } placeholder="* Title of game..." required />
                            <label>Summary:</label>
                            <textarea className="textArea" value={ summary } onChange={ (e) => setSummary(e.target.value) } placeholder="* Summary of game..." required></textarea>
                            <label>Cover link:</label>
                            <input type="text" value={cover} onChange={ (e) => setCover(e.target.value)} placeholder="* Cover of game (link)..." required />
                            <label>Trailer link:</label>
                            <input type="text" value={ trailer } onChange={ (e) => setTrailer(e.target.value) } placeholder="Trailer for the game..." />
                            <label>Visibility:</label>
                            <select value={publicVisible} onChange={ (e) => setPublicVisible(e.target.value) }>
                                <option value={ false }>Private</option>
                                <option value={ true }>Public</option>
                            </select>

                            <div className="formBtns">
                                <Link className="formBtn" to="/admin/games">Return</Link>
                                <button className="formBtn" type="submit">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) }
            { !game && error && (
                <div className="formPage">
                    <h1>{ error }</h1>
                </div>
            ) }
        </>
    );
}
 
export default GameUpdate;