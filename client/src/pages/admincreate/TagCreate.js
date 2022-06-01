import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const TagCreate = () => {
    const [name, setName] = useState("");
    const [meaning, setMeaning] = useState("");
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const createTag = async (tagData) => {
        const response = await axios.post("/api/tags/", tagData, config);
    
        if(response.data){
            console.log(response.data)
        }
    
        return response.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagData = {name, meaning};
        await createTag(tagData);
        navigate("/admin/tags/");
    }

    return (
        <div className="formPage">
            <h1>Create a game tag</h1>

            <div className="formData">
                <form onSubmit={ handleSubmit }>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name..." required />
                    <textarea className="textArea" value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Tags meaning..."></textarea>
                    
                    <div className="formBtns">
                        <Link to="/admin/tags" className="formBtn">Return</Link>
                        <button className="formBtn" type="submit">Create tag</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default TagCreate;