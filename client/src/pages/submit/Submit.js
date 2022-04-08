import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitGame } from "../../redux/features/games/gameSlice";
import "./Submit.css";

const Submit = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [cover, setCover] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(submitGame({ title, summary, cover }));
        setTitle("");
        setSummary("");
        setCover("");
        navigate("/games");
    }

    return (
        <>
            <h1>Submit a game</h1>

            <form className="submitForm" onSubmit={ handleSubmit }>
                <section className="gameTags">
                    <h2>Game tags</h2>
                </section>

                <section className="formInput">
                    <div className="row">
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title of a game" required />
                    </div><hr />

                    <div className="row">
                        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Game summary" required></textarea>
                    </div><hr />

                    <div className="row">
                        <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Game cover link" />
                    </div><hr />

                    <div className="row">
                        <input type="submit" value="Submit" />
                    </div>
                </section>
            </form>
        </>
    );
}
 
export default Submit;