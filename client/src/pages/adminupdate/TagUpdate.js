import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/message/Message";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";

const TagUpdate = () => {
    const { id } = useParams();
    const { data: tag, isPending, error } = useFetch(`/api/tags/${id}`);
    const [name, setName] = useState("");
    const [meaning, setMeaning] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(name){
            const response = await axios.put(`/api/tags/${id}`, { name, meaning }, config);
            if(response){
                if(response.status === 200){
                    setIsSuccess(true)
                }
                setIsSubmitted(true);

                setTimeout(() => {
                    navigate("/admin/tags");
                }, [2000]);
            }else{
                alert("No response!");
            }
        }else{
            alert("Provide - name of tag");
        }
    }

    useEffect(() => {
        if(tag){
            setName(tag.name);
            setMeaning(tag.meaning)
        }
    }, [tag]);

    if(!isSubmitted){
        return (
            <>
                { isPending && <Pending text={"Loading tag data..."} center={true} size={"2rem"} /> }
                { error && !tag &&  (
                    <div className="formPage">
                        <h1>{ error }</h1>
                    </div>
                ) }
                { !isPending && tag && (
                    <div className="formPage">
                        <h1>Selected tag: { tag.name }</h1>
    
                        <div className="formData">
                            <form onSubmit={ handleSubmit }>
                                <label>Tag name:</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="* Tag name..." required />
                                <label>Meaning:</label>
                                <textarea className="textArea" value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Tags meaning..."></textarea>
                                
                                <div className="formBtns">
                                    <Link className="formBtn" to="/admin/tags">Return</Link>
                                    <button className="formBtn" type="submit">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) }
            </>
        );
    }else{
        if(isSuccess){
            return (
                <Message
                    title={"Update was successful!"}
                    message={`Tag updated: ${ name }`}
                    success={ true }
                />
            );
        }else{
            return (
                <Message
                    title={"Update failed!"}
                    message={`Failed to update: ${ name }`}
                    success={ false }
                />
            );
        }
    }
}
 
export default TagUpdate;