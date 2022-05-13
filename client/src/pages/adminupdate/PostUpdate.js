import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/message/Message";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";

const PostUpdate = () => {
    const { id } = useParams();
    const { data: post, isPending, error } = useFetch(`/api/posts/${id}`);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
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
        if(title && text){
            const response = await axios.put(`/api/posts/${id}`, { title, text }, config);
            if(response){
                if(response.status === 200){
                    setIsSuccess(true)
                }
                setIsSubmitted(true);

                setTimeout(() => {
                    navigate("/admin/posts");
                }, [2000]);
            }else{
                alert("No response!");
            }
        }else{
            alert("Provide - title and text for the post");
        }
    }

    useEffect(() => {
        if(post){
            setTitle(post.title);
            setText(post.text);
        }
    }, [post]);

    if(!isSubmitted){
        return (
            <>
                { isPending && <Pending text={"Loading post data..."} center={true} size={"2rem"} /> }
                { error && !post && (
                    <div className="formPage">
                        <h1>{ error }</h1>
                    </div>
                ) }
                { !isPending && post && (
                    <div className="formPage">
                        <h1>Update post: { post.title }</h1>
    
                        <div className="formData">
                            <form onSubmit={ handleSubmit }>
                                <label>Post title:</label>
                                <input type="text" value={ title } onChange={(e) => setTitle(e.target.value)} placeholder="* Post title..." required />
                                <label>Post text:</label>
                                <textarea className="textArea" value={ text } onChange={(e) => setText(e.target.value)} placeholder="Posts text..."></textarea>
                                
                                <div className="formBtns">
                                    <Link className="formBtn" to="/admin/posts">Return</Link>
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
                    message={`Post updated: ${ title }`}
                    success={ true }
                />
            );
        }else{
            return (
                <Message
                    title={"Update failed!"}
                    message={`Failed to update: ${ title }`}
                    success={ false }
                />
            );
        }
    }
}
 
export default PostUpdate;