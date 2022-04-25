import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [picture, setPicture] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [updateProfile, setUpdateProfile] = useState(false);

    const profilePics = [
        { name: "Default picture", picture: "profile1.jpg" },
        { name: "Gentleman", picture: "profile2.jpg" },
        { name: "Among us", picture: "profile3.jpg" },
        { name: "Dark smile", picture: "profile4.jpg" },
        { name: "Ape", picture: "profile5.jpg" },
        { name: "Neon girl", picture: "profile6.jpg" }
    ];
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log("Submitted")
    }
    
    useEffect(() => {
        if(user){
            setPicture(user.picture);
        }else{
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="gameRatePages">
            { user && updateProfile === false ? (
                <>
                    <h1>My profile</h1>

                    <div className="usersData">
                        <section className="userImg">
                            <img src={require(`../../images/${user.picture}`)} alt="Profile pic" />
                            <h2>{ user.name }</h2>
                        </section>

                        <section className="userInfo">
                            <h2>Email: { user.email }</h2>
                            <h2>Role: { user.role }</h2>
                            <h2>Review count: { user.reviews }</h2>
                            <div className="profileBtns">
                                <button onClick={() => setUpdateProfile(!updateProfile)}>Update information</button>
                            </div>
                        </section>
                    </div>
                </>
            ) : (
                <>
                    <h1>Update profile</h1>

                    <div className="usersData">
                        <section className="userImg">
                            <img src={require(`../../images/${picture}`)} alt="Profile pic" />
                            <h2>{ user.name }</h2>
                        </section>

                        <section className="userInfo">
                            <form onSubmit={handleSubmit}>
                                <label>Select picture:</label>
                                <select value={picture} onChange={(e) => setPicture(e.target.value)}>
                                    { profilePics.map((pic, index) => (
                                        <option value={pic.picture} key={index}>{ pic.name }</option>
                                    )) }
                                </select>

                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password"/>
                                <input type="password" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} placeholder="Repeat password" />
                            
                                <div className="profileBtns">
                                    <button onClick={() => setUpdateProfile(!updateProfile)}>Cancel</button>
                                    <button type="submit">Update</button>
                                </div>
                            </form>
                        </section>
                    </div>
                </>
            ) }
        </div>
    );
}
 
export default Profile;