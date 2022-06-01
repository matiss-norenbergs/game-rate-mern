import axios from "axios";
import { faCheck, faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FormatDateNum from "../../components/formatdate/FormatDateNum";
import Pending from "../../components/pending/Pending";
import useAdminFetch from "../../hooks/useAdminFetch";

const AdminGames = () => {
    const { data, isPending, error } = useAdminFetch("/api/games/");
    const [games, setGames] = useState();
    const [searchValue, setSearchValue] = useState("");
    const searchInput = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    useEffect(() => {
        data && setGames(data)
    }, [data]);

    async function handleDelete(id){
        await axios.delete(`/api/games/${id}`, config);
        const newGames = games.filter((game) => game._id !== id);
        setGames(newGames);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchValue(searchInput.current.value);
    }

    return (
        <>
            <Link to="/submit" className="adminBtn">Add game</Link>

            <h1>Game list</h1>

            { isPending && <Pending text={"Fetching games..."} center={true} size={"2rem"} /> }
            { error && !games && <h1>Error: { error }</h1> }
            { !isPending && games &&
                <>
                    <form onSubmit={ handleSubmit } className="tableFilter">
                        <input type="text" ref={ searchInput } placeholder="Search by title" />
                        <button type="submit"><FontAwesomeIcon icon={ faMagnifyingGlass } /></button>
                    </form>

                    <table>
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Title</th>
                                <th>Tags</th>
                                <th>Submitted</th>
                                <th>Submitted by</th>
                                <th>Public</th>
                                <th>Reviews</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            { games.filter((value) => {
                                if(!searchValue){
                                    return value;
                                }else if(value.title.toLowerCase().includes(searchValue.toLowerCase())){
                                    return value;
                                }
                            }).map((game, index) => (
                                <tr key={ index }>
                                    <td className="centerCell"><img src={game.cover} alt={game.title} width="90" /></td>
                                    <td className="titleCell">
                                        <Link to={`/game/${game._id}`}>{ game.title }</Link>
                                    </td>
                                    <td className="centerCell">{ game.tags.length }</td>
                                    <td>{ FormatDateNum(game.createdAt) }</td>
                                    
                                    <td className="titleCell">
                                        <Link to={`/user/${game.submittedBy}`}>{ game.submittedBy }</Link>
                                    </td>

                                    <td className="centerCell">
                                        { game.publicVisible === true ?
                                            <FontAwesomeIcon className="icon green" icon={faCheck} />
                                        :
                                            <FontAwesomeIcon className="icon red" icon={faTimes} /> 
                                        }
                                    </td>
                                    
                                    <td className="centerCell">{ game.reviews.length }</td>
                                    <td className="centerCell">
                                        <Link className="cellOption" to={`/admin/game/update/${game._id}`}>Update</Link>|
                                        <button className="cellOption" onClick={ () => handleDelete(game._id) }>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
        </>
    );
}
 
export default AdminGames;