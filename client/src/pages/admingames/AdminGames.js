import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
        require("moment/locale/lv");

        let daysAgo = moment(date).format('LLL');
        return daysAgo;
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

            { isPending && <h1>Fetching games...</h1> }
            { error && !games && <h1>Error: { error }</h1> }
            { games &&
                <table>
                    <thead>
                        <tr>
                            <th className="imageCell">Cover</th>
                            <th>Title</th>
                            <th>Created</th>
                            <th>Submitted by</th>
                            <th>Public</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>{
                        games.map((game) => (
                            <tr key={game._id}>
                                <td className="imageCell"><img src={game.cover} alt={game.title} /></td>
                                <td>{ game.title }</td>
                                <td>{ whenCreated(game.createdAt) }</td>
                                <td>{ game.submittedBy }</td>
                                <td className="publicCell">{ game.publicVisible === true ? <FontAwesomeIcon className="icon green" icon={faCheck} /> : <FontAwesomeIcon className="icon red" icon={faTimes} /> }</td>
                                <td className="optionCell">
                                    <Link className="cellOption" to={`/admin/games/update/${game._id}`}>Update</Link>|
                                    <button className="cellOption" onClick={ () => handleDelete(game._id) }>Delete</button>
                                </td>
                            </tr>
                        ))
                    }</tbody>
                </table>
            }
        </>
    );
}
 
export default AdminGames;