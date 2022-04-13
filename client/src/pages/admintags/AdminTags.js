import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminTags = () => {
    const { data, isPending, error } = useFetch("/api/tags/");
    const [tags, setTags] = useState();
    let nr = 1;

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    useEffect(() => {
        data && setTags(data)
    }, [data]);

    async function handleDelete(id){
        await axios.delete(`/api/tags/${id}`, config);
        const newTags = tags.filter((tag) => tag._id !== id);
        setTags(newTags);
    }

    return (
        <>
            <h1>Game tags</h1>

            { isPending && <h1>Fetching tags...</h1> }
            { error && !tags && <h1>Error: { error }</h1> }
            { tags && 
                <table>
                    <thead>
                        <tr>
                            <th>Nr.</th>
                            <th>Tag name</th>
                            <th>Tag meaning</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{
                        tags.map((tag) => (
                            <tr key={ tag._id }>
                                <td>{ nr++ }.</td>
                                <td>{ tag.name }</td>
                                <td>{ tag.meaning ? tag.meaning : "not defined" }</td>
                                <td className="optionCell">
                                    <Link className="cellOption" to={`/admin/tags/update/${tag._id}`}>Update</Link>|
                                    <button className="cellOption" onClick={ () => handleDelete(tag._id) }>Delete</button>    
                                </td>
                            </tr>
                        ))
                    }</tbody>
                </table>
            }
        </>
    );
}
 
export default AdminTags;