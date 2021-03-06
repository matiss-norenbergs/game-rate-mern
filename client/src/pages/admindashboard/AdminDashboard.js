import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormatDateNum from "../../components/formatdate/FormatDateNum";
import Pending from "../../components/pending/Pending";
import useAdminFetch from "../../hooks/useAdminFetch";

const AdminDashboard = () => {
    const { data, isPending, error } = useAdminFetch('/api/games/admin/gamedata');
    const { data: data2, isPending: isPending2, error: error2 } = useAdminFetch('/api/users/count');
    const { data: data3, isPending: isPending3, error: error3 } = useAdminFetch('/api/games/admin/submittedlast');
    let nr = 11;

    return (
        <>
            <h1>Admin dashboard</h1>

            { error && error2 && error3 && <h2>Error...</h2> }
            { isPending && isPending2 && isPending3 && <Pending text={"Loading data..."} center={true} size={"1.6rem"} /> }
            { !isPending && data && !isPending2 && data2 && !isPending3 && data3 && (
                <>
                    <div className="dashSum">
                        <div className="sumCard">
                            <h2>Total games</h2>
                            <span>{ data.games }</span>
                        </div>

                        <div className="sumCard">
                            <h2>Total public games</h2>
                            <span>{ data.publicGames }</span>
                        </div>

                        <div className="sumCard">
                            <h2>Games submitted today</h2>
                            <span>{ data.gamesSubmitted }</span>
                        </div>

                        <div className="sumCard">
                            <h2>Total users</h2>
                            <span>{ data2.users }</span>
                        </div>
                    </div>
                
                    <h2>Last 10 submitted games</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nr</th>
                                <th>Title</th>
                                <th>Created at</th>
                                <th>Updated at</th>
                                <th>Public</th>
                            </tr>
                        </thead>

                        <tbody>
                            { data3.map((game, index) => {
                                nr--;
                                return (
                                    <tr key={ index }>
                                        <td>{ nr }.</td>
                                        <td>{ game.title }</td>
                                        <td>{ FormatDateNum(game.createdAt) }</td>
                                        <td>{ FormatDateNum(game.updatedAt) }</td>
                                        <td className="centerCell">
                                            { game.publicVisible === true ?
                                                <FontAwesomeIcon className="icon green" icon={faCheck} />
                                            : 
                                                <FontAwesomeIcon className="icon red" icon={faTimes} />
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </>
    );
}
 
export default AdminDashboard;