import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";

const AdminPosts = () => {
    const { data, isPending, error } = useFetch("/api/posts/");
    const [posts, setPosts] = useState();

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    useEffect(() => {
        data && setPosts(data)
    }, [data]);

    const whenCreated = (date) => {
        const moment = require("moment");
        let dateFormated = moment(date).format('DD.MM.YYYY, HH:mm');

        return dateFormated;
    }

    async function handleDelete(id){
        await axios.delete(`/api/posts/${id}`, config);
        const newPosts = posts.filter((post) => post._id !== id);
        setPosts(newPosts);
    }

    return (
        <>
            <h1>News posts</h1>

            <Link to="/admin/post/create" className="adminBtn">Create post</Link>

            { isPending && <Pending text={"Fetching posts..."} center={true} size={"2rem"} /> }
            { error && !posts && <h1>Error: { error }</h1> }
            { posts && 
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Text</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { posts.map((post, index) => (
                            <tr key={ index }>
                                <td>{ post.title }</td>
                                <td>{ post.text }</td>
                                <td>{ whenCreated(post.createdAt) }</td>
                                <td className="centerCell">
                                    <Link className="cellOption" to={`/admin/post/update/${post._id}`}>Update</Link>|
                                    <button className="cellOption" onClick={ () => handleDelete(post._id) }>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
}
 
export default AdminPosts;