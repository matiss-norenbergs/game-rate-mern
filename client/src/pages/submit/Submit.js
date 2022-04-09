import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { submitGame, reset } from "../../redux/features/games/gameSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import "./Submit.css";

const Submit = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [cover, setCover] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const { data: tags, isPending: dataIsPending, error } = useFetch("/api/tags/");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isError, isSuccess, isPending, message } = useSelector((state) => state.games);

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(submitGame({ title, summary, cover }));
        setTitle("");
        setSummary("");
        setCover("");
        setSubmitted(true);

        setTimeout(() => {
            dispatch(reset());
            navigate("/games");
        },[ 3000]);
    }

    if(!user){
        return (
            <div className="submitPageMessage">
                <h1>You must be logged in to submit a game</h1>
                <span>Click <Link to="/login">HERE</Link> to login</span>
            </div>
        )
    }

    if(!submitted){
        return (
            <>
                <h1>Submit a game</h1>
    
                <form className="submitForm" onSubmit={ handleSubmit }>
                    <section className="gameTags">
                        <h2>Game tags</h2>

                        { !dataIsPending && tags.map((tag) => (
                            <div className="tagRow" key={tag._id}>
                                <input type="checkbox" name={ tag.name } />
                                <label htmlFor={ tag.name } title={ tag.meaning }>{ tag.name }</label>
                            </div>
                        )) }
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
    }else{
        if(isPending){
            return (
                <h1>Processing...</h1>
            )
        }else{
            if(isSuccess && !isError){
                return (
                    <div className="submitPageMessage">
                        <h1>Submission was successful!</h1>
                        { message.message && <h2>{ message.message }</h2> }
                        <i className="icon green"><FontAwesomeIcon icon={ faCheck } /></i>
                    </div>
                )
            }else{
                return (
                    <div className="submitPageMessage">
                        <h1>Something went wrong...</h1>
                        { message.message && <h2>{ message.message }</h2> }
                        <i className="icon red"><FontAwesomeIcon icon={ faTimes } /></i>
                    </div>
                )
            }
        }
    }
}
 
export default Submit;