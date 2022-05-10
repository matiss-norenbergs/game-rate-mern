import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Pending from "../../components/pending/Pending";
import useAdminFetch from "../../hooks/useAdminFetch";

const AdminUsers = () => {
    const { data: users, isPending, error } = useAdminFetch("/api/users/allusers");
    const [searchValue, setSearchValue] = useState("");
    const searchInput = useRef(null);

    const dateFormat = (date) => {
        const moment = require("moment");
        let daysAgo = moment(date).format('DD.MM.YYYY, HH:mm');
        
        return daysAgo;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchValue(searchInput.current.value);
    }

    return (
        <>
            <h1>GameRate users</h1>

            { isPending && <Pending text={"Fetching users..."} center={true} size={"2rem"} /> }
            { error && !users && <h1>Error: { error }</h1> }
            { !isPending && users &&
                <>
                    <form onSubmit={ handleSubmit } className="tableFilter">
                        <input type="text" ref={searchInput} placeholder="Search by name or ID" />
                        <button type="submit"><FontAwesomeIcon icon={ faMagnifyingGlass } /></button>
                    </form>

                    <table>
                        <thead>
                            <tr>
                                <th>Users ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Updated</th>
                            </tr>
                        </thead>

                        <tbody>
                            { users.filter((value) => {
                                if(!searchValue){
                                    return value
                                }else if(value.name.toLowerCase().includes(searchValue.toLowerCase()) || value._id.toLowerCase().includes(searchValue.toLowerCase())){
                                    return value;
                                }
                            }).map((user, index) => (
                                <tr key={ index }>
                                    <td className="titleCell"><Link to={`/user/${user._id}`}>{ user._id }</Link></td>
                                    <td>{ user.name }</td>
                                    <td>{ user.email }</td>
                                    <td>{ user.role }</td>
                                    <td>{ dateFormat(user.createdAt) }</td>
                                    <td>{ dateFormat(user.updatedAt) }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
        </>
    );
}
 
export default AdminUsers;