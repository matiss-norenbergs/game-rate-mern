import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useSelector } from "react-redux";

const TagUpdate = () => {
    const { id } = useParams();
    const { data: tag, isPending, error } = useFetch(`/api/tags/${id}`);
    const [name, setName] = useState("");
    const [meaning, setMeaning] = useState("");
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.put(`/api/tags/${id}`, { name, meaning }, config);
        console.log(response);
        navigate("/admin/tags");
    }

    useEffect(() => {
        if(tag){
            setName(tag.name);
            setMeaning(tag.meaning)
        }
    }, [tag]);

    return (
        <>
            { !isPending && tag && (
                <div className="formPage">
                    <h1>Selected tag: { tag.name }</h1>

                    <form onSubmit={ handleSubmit }>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="* Tag name..." required />
                        <textarea className="textArea" value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Tags meaning..."></textarea>
                        
                        <div className="formBtns">
                            <Link className="formBtn" to="/admin/tags">Return</Link>
                            <button className="formBtn" type="submit">Update</button>
                        </div>
                    </form>
                </div>
            ) }
            { !isPending && error && (
                <div className="formPage">
                    <h1>{ error }</h1>
                </div>
            ) }
        </>
    );
}
 
export default TagUpdate;