import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Pending from "../../components/pending/Pending";
import Message from "../../components/message/Message";

const GameUpdate = () => {
    const { id } = useParams();
    const { data: game, isPending, error } = useFetch(`/api/games/${id}`);
    const { data: tagList, isPending: tagIsPending, tagError } = useFetch("/api/tags/");

    const [title, setTitle] = useState("");
    const [cover, setCover] = useState("");
    const [summary, setSummary] = useState("");
    const [tags, setTags] = useState([]);
    const [trailer, setTrailer] = useState("");
    const [publicVisible, setPublicVisible] = useState(false);
    const [checkedState, setCheckedState] = useState();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    //Gets selected tags once the game data and all tags are fetched
    useEffect(() => {
        if(!tagIsPending && tagList && game && !isPending){
            let checkArray = new Array(tagList.length).fill(false);

            tagList.forEach(({ name }, index) => {
                if(game.tags.includes(name)){
                    checkArray[index] = true;
                }
            });

            setCheckedState(checkArray);
        }
    }, [tagList, tagIsPending, game, isPending]);

    //Sets checked tags once changes are made from select list
    const handleOnChange = async (position) => {
        const updatedCheckedState = checkedState.map((item, index) => 
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);
    }

    //Sets selected tags
    useEffect(() => {
        const setSelectedTags = () => {
            let selected = [];

            tagList.forEach(({ name }, index) => {
                if(checkedState[index] === true){
                    selected.push(name)
                }
            });

            setTags(selected);
        }

        if(checkedState && checkedState.length > 0){
            setSelectedTags();
        }
    }, [checkedState, tagList]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(title && cover && summary && tags.length > 0){
            const gameData = { title, cover, summary, trailer, tags, publicVisible };
            const response = await axios.put(`/api/games/${id}`, gameData, config);
            if(response){
                if(response.status === 200){
                    setIsSuccess(true)
                }
                setIsSubmitted(true);

                setTimeout(() => {
                    navigate("/admin/games");
                }, [2000]);
            }else{
                alert("No response!");
            }
        }else{
            alert("Provide - title, cover, summary and at least 1 tag");
        }
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

    if(!isSubmitted){
        return (
            <>
                { isPending && <Pending text={"Loading game data..."} center={true} size={"2rem"} /> }
                { !isPending && game && (
                    <div className="formPage">
                        <h1>Selected game: { game.title }</h1>
    
                        <div className="formData">
                            <div className="formImage">
                                { cover && <img src={ cover } alt={ game.title } /> }
                                { tagIsPending && <Pending text={"Loading..."} /> }
                                { !tagIsPending && tags.length > 0 && (
                                    <ul className="selecTags">
                                        <h2>Selected tags:</h2>
    
                                        { tags.map((tag, index) => (
                                            <li key={ index }>{ tag }</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
    
                            <form onSubmit={ handleSubmit }>
                                <label>Title:</label>
                                <input type="text" value={ title } onChange={ (e) => setTitle(e.target.value) } placeholder="* Title of game..." required />
    
                                <label>Summary:</label>
                                <textarea className="textArea" value={ summary } onChange={ (e) => setSummary(e.target.value) } placeholder="* Summary of game..." required></textarea>
    
                                <label>Cover link:</label>
                                <input type="text" value={cover} onChange={ (e) => setCover(e.target.value)} placeholder="* Cover of game (link)..." required />
    
                                <label>Trailer video id:</label>
                                <input type="text" value={ trailer } onChange={ (e) => setTrailer(e.target.value) } placeholder="Trailer id for the game..." />
                                
                                <div className="checkList">
                                    <label>Available tags:</label>
    
                                    { !tagIsPending && tagError && (
                                        <h2>Tags can't be loaded...</h2>
                                    )}
                                    { tagIsPending && <Pending text={"Loading..."} /> }
                                    { !tagIsPending && checkedState && tagList && tagList.length > 0 && (
                                        <div className="tags">
                                            { tagList.map(({name, meaning}, index) => (
                                                <div className="tagRow" key={index}>
                                                    <input type="checkbox" id={`custom-checkbox-${index}`} name={ name } value={ name } checked={ checkedState[index] } onChange={() => handleOnChange(index)} />
                                                    <label htmlFor={`custom-checkbox-${index}`} title={ meaning }>{ name }</label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <label>Visibility:</label>
                                <select value={ publicVisible } onChange={ (e) => setPublicVisible(e.target.value) }>
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
    }else{
        if(isSuccess){
            return (
                <Message
                    title={"Update was successful!"}
                    message={`Game updated: ${ title }`}
                    success={ true }
                />
            );
        }else{
            return (
                <Message
                    title={"Update failed!"}
                    message={`Failed to update: ${ title }`}
                    success={ false }
                />
            );
        }
    }
}
 
export default GameUpdate;