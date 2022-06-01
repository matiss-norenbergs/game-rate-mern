import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const PostCreate = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const createPost = async (data) => {
        const response = await axios.post("/api/posts/", data, config);
    
        if(response.data){
            console.log(response.data)
        }
    
        return response.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {title, text};
        await createPost(postData);
        navigate("/admin/posts/");
    }

    return (
        <div className="formPage">
            <h1>Create a news post</h1>

            <div className="formData">
                <form onSubmit={ handleSubmit }>
                    <input type="text" value={ title } onChange={(e) => setTitle(e.target.value)} placeholder="Posts title..." required />
                    <textarea className="textArea" value={ text } onChange={(e) => setText(e.target.value)} placeholder="Posts text..."></textarea>
                    
                    <div className="formBtns">
                        <Link to="/admin/posts" className="formBtn">Return</Link>
                        <button className="formBtn" type="submit">Create post</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default PostCreate;