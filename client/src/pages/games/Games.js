import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp, faPlus } from "@fortawesome/free-solid-svg-icons"
import GameList from "../../components/gamelist/GameList";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";
import "./Games.css";

const Games = () => {
    const [field, setField] = useState("publishedAt");
    const [order, setOrder] = useState(-1);
    const [tags, setTags] = useState([]);
    const [checkedState, setCheckedState] = useState();
    const [display, setDisplay] = useState("none");
    const { data: games, isPending, error } = useFetch(`/api/games/public/${field}/${order}/${JSON.stringify(tags)}`);
    const { data: tagList, isPending: dataIsPending, error: tagError } = useFetch("/api/tags/");

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
    
    const setSelectedTags = () => {
        let selected = [];

        tagList.forEach(({ name }, index) => {
            if(checkedState[index] === true){
                selected.push(name)
            }
        });

        setTags(selected);
    }

    function showTagList(){
        if(display === "none"){
            setDisplay("flex");
        }else{
            setDisplay("none");
        }
    }

    function resetFilters(){
        setCheckedState(
            new Array(tagList.length).fill(false)
        );
        setTags([]);
        setField("publishedAt");
        setOrder(-1);
    }

    return (
        <div className="gameRatePages">
            <div className="gamesBtns">
                {/* <button className="btn">Filter</button> */}
                <Link className="btn" to="/submit">Submit a game <FontAwesomeIcon className="icon" icon={ faPlus } /></Link>
            </div>

            <div className="gameFilter">
                <div className="filter">
                    <label>Sort by: </label>
                    <select value={ field } onChange={ (e) => setField(e.target.value) }>
                        <option value="publishedAt">Publishing date</option>
                        <option value="title">Title</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>

                <div className="filter">
                    <label>Order: </label>
                    <select value={ order } onChange={ (e) => setOrder(e.target.value) }>
                        <option value={-1}>Descending &#8595;</option>
                        <option value={1}>Ascending &#8593;</option>
                    </select>
                </div>

                <div className="filter">
                    { display === "none" ?
                        <button onClick={ () => showTagList() }>
                            Show tags <FontAwesomeIcon icon={faAnglesDown} />
                        </button>
                    :
                        <>
                            <button onClick={ () => showTagList() }>
                                Hide tags <FontAwesomeIcon icon={faAnglesUp} />
                            </button>

                            <button onClick={ setSelectedTags }>Apply tag filter</button>
                        </>
                    }

                    <button onClick={ () => resetFilters() }>Reset</button>
                </div>
            </div>

            <div className="gameFilterTags" style={{ display: display }}>
                { tagError && <h2>Error: { tagError }</h2> }
                { dataIsPending && <Pending text={"Loading tags..."} /> }
                { !dataIsPending && checkedState && tagList.map(({name, meaning}, index) => {
                    return (
                        <div className="tagRow" key={index}>
                            <input type="checkbox" id={`custom-checkbox-${index}`} name={ name } value={ name } checked={ checkedState[index] } onChange={() => handleOnChange(index)} />
                            <label htmlFor={`custom-checkbox-${index}`} title={ meaning }>{ name }</label>
                        </div>
                    )
                })}
            </div>

            { error && !games && <span>{ error }</span> }
            { isPending && <Pending text={"Loading games..."} /> }
            { !isPending && games && <GameList games={ games } title="All published games" /> }
        </div>
    );
}
 
export default Games;