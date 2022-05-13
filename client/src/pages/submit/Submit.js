import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { submitGame, reset } from "../../redux/features/games/gameSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import Pending from "../../components/pending/Pending";
import Message from "../../components/message/Message";
import "./Submit.css";

const Submit = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [cover, setCover] = useState("");
    const [checkedState, setCheckedState] = useState();
    const [tags, setTags] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [tagsExpand, setTagsExpand] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { isError, isSuccess, isPending, message } = useSelector((state) => state.games);
    const { data: tagList, isPending: dataIsPending, error } = useFetch("/api/tags/");

    const getScreenWidth = () => {
        setScreenWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', getScreenWidth);

        return () => {
            window.removeEventListener('resize', getScreenWidth);
        }
    }, [screenWidth]);

    useEffect(() => {
        if(!dataIsPending && tagList){
            setCheckedState(
                new Array(tagList.length).fill(false)
            );
        }
    }, [tagList, dataIsPending]);

    const handleOnChange = async (position) => {
        const updatedCheckedState = checkedState.map((item, index) => 
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);
    }

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

    function checkIfImageExists(url, callback) {
        const img = new Image();
        img.src = url;
        
        if (img.complete) {
            callback(true);
        } else {
            img.onload = () => {
                callback(true);
            };
            
            img.onerror = () => {
                callback(false);
            };
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(title && summary && cover && tags.length > 0 ){
            checkIfImageExists(cover, (exists) => {
                if(exists){
                    dispatch(submitGame({ title, summary, cover, tags }));
                    setTitle("");
                    setSummary("");
                    setCover("");
                    setSubmitted(true);
    
                    if(!isPending){
                        setTimeout(() => {
                            dispatch(reset());
                            navigate("/games");
                        },[ 3000]);
                    }
                }else{
                    alert('Image url isn\'t valid!')
                }
            });
        }else{
            alert("Provide all information!")
        }
    }

    if(!user){
        return (
            <div className="submitPageMessage">
                <div className="message">
                    <h1>You must be logged in to submit a game</h1>
                    <span>Click <Link to="/login">HERE</Link> to login</span>
                </div>
            </div>
        )
    }

    if(!submitted){
        return (
            <div className="gameRatePages">
                <h1>Submit a game</h1>
    
                <form className="submitForm" onSubmit={ handleSubmit }>
                    <section className="gameTags" style={ screenWidth <= 940 ? { width: tagsExpand ? "100%" : "0" } : {} }>
                        <h2>Game tags</h2>

                        <div className="tagList">
                            { !dataIsPending && error && (
                                <h4>Error... { error }</h4>
                            )}
                            { dataIsPending && <Pending text={"Loading..."} size={"1.2rem"} /> }
                            { !dataIsPending && checkedState && tagList.map(({name, meaning}, index) =>  {
                                return (
                                    <div className="tagRow" key={index}>
                                        <input type="checkbox" id={`custom-checkbox-${index}`} name={ name } value={ name } checked={ checkedState[index] } onChange={() => handleOnChange(index)} />
                                        <label htmlFor={`custom-checkbox-${index}`} title={ meaning }>{ name }</label>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    <button className="expandBtn" type="button" onClick={ () => setTagsExpand(!tagsExpand) }>
                        { !tagsExpand ?
                            <FontAwesomeIcon icon={ faAnglesRight } />
                         :
                            <FontAwesomeIcon icon={ faAnglesLeft } />
                        }
                    </button>
    
                    <section className="formInput" style={ screenWidth <= 940 ? { width: !tagsExpand ? "100%" : "0" } : {} }>
                        <div className="row">
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title of a game" required />
                        </div><hr />
    
                        <div className="row">
                            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Game summary" required></textarea>
                        </div><hr />
    
                        <div className="row">
                            <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Game cover link" required />
                        </div><hr />
    
                        <div className="row">
                            <input type="submit" value="Submit" />
                        </div>
                    </section>
                </form>
            </div>
        );
    }else{
        if(isPending){
            return (
                <Pending text={"Processing..."} center={true} size={"2.2rem"} />
            )
        }else{
            if(isSuccess && !isError && message){
                return (
                    <Message 
                        title={"Submission was successful!"}
                        message={ message }
                        success={ true }
                    />
                )
            }else if(message){
                return (
                    <Message 
                        title={"Something went wrong!"}
                        message={ message }
                        success={ false }
                    />
                ) 
            }
        }
    }
}
 
export default Submit;