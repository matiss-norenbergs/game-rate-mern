import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Pending from "../../components/pending/Pending";
import useAdminFetch from "../../hooks/useAdminFetch";

const AdminGames = () => {
    const { data, isPending, error } = useAdminFetch("/api/games/");
    const [games, setGames] = useState();

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const whenCreated = (date) => {
        const moment = require("moment");
        let dateFormated = moment(date).format('DD.MM.YYYY, HH:mm');

        return dateFormated;
    }

    useEffect(() => {
        data && setGames(data)
    }, [data]);

    async function handleDelete(id){
        await axios.delete(`/api/games/${id}`, config);
        const newGames = games.filter((game) => game._id !== id);
        setGames(newGames);
    }

    return (
        <>
            <h1>Game list</h1>

            { isPending && <Pending text={"Fetching games..."} center={true} size={"2rem"} /> }
            { error && !games && <h1>Error: { error }</h1> }
            { !isPending && games &&
                <table>
                    <thead>
                        <tr>
                            <th className="imageCell">Cover</th>
                            <th>Title</th>
                            <th>Tags</th>
                            <th>Created</th>
                            <th>Submitted by</th>
                            <th>Public</th>
                            <th>Reviews</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        { games.map((game, index) => (
                            <tr key={ index }>
                                <td className="imageCell"><img src={game.cover} alt={game.title} /></td>
                                <td className="titleCell">
                                    <Link to={`/game/${game._id}`}>{ game.title }</Link>
                                </td>
                                <td className="numberCell">{ game.tags.length }</td>
                                <td>{ whenCreated(game.createdAt) }</td>
                                <td>{ game.submittedBy }</td>

                                <td className="publicCell">
                                    { game.publicVisible === true ?
                                        <FontAwesomeIcon className="icon green" icon={faCheck} />
                                    :
                                        <FontAwesomeIcon className="icon red" icon={faTimes} /> 
                                    }
                                </td>
                                
                                <td className="numberCell">{ game.reviews.length }</td>
                                <td className="optionCell">
                                    <Link className="cellOption" to={`/admin/games/update/${game._id}`}>Update</Link>|
                                    <button className="cellOption" onClick={ () => handleDelete(game._id) }>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
}
 
export default AdminGames;