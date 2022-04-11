import { useState } from "react";

const TagCreate = () => {
    const [name, setName] = useState("");
    const [meaning, setMeaning] = useState("");

    return (
        <div className="formPage">
            <h1>Add a game tag</h1>

            <form>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name..." />
                <textarea className="textArea" value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Tags meaning..."></textarea>
                <button type="submit" className="formBtn">Create tag</button>
            </form>
        </div>
    );
}
 
export default TagCreate;