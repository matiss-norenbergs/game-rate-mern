import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";
import "./Profile.css";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { data: games, isPending, error: gameError } = useFetch(`/api/games/users_reviews/${user._id}`);

    const [picture, setPicture] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [updateProfile, setUpdateProfile] = useState(false);

    const profilePics = [
        { name: "Default picture", picture: "profile1.jpg" },
        { name: "Gentleman", picture: "profile2.jpg" },
        { name: "Among us", picture: "profile3.jpg" },
        { name: "Dark smile", picture: "profile4.jpg" },
        { name: "Ape", picture: "profile5.jpg" },
        { name: "Neon girl", picture: "profile6.jpg" }
    ];

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const updatePassword = async () => {
        const response = await axios.put(`/api/users/updatepass`, { password, password2 }, config);

        if(response && response.status === 200){
            setMessage(response.data.message);
        }

        setUpdateProfile(false);
        setPassword("");
        setPassword2("");

        setTimeout(() => {
            setMessage("");
        }, [3000]);
    }

    const updatePfp = async () => {
        const response = await axios.put(`/api/users/updatepicture`, { picture }, config);

        if(response && response.status === 200){
            let myData = JSON.parse(localStorage.getItem("user"));
            myData.picture = picture;
            localStorage.setItem("user", JSON.stringify(myData));
            window.location.reload(false);
        }

        setUpdateProfile(false);
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(password.length >= 8 && password2.length >= 8 && password === password2){
            updatePassword();
        }else{
            setError("Password is too short or they do not match...");

            setTimeout(() => {
                setError("");
            }, [3000]);
        }
    }

    const dateFormat = (date) => {
        const moment = require("moment");
        let daysAgo = moment(date).format('DD.MM.YYYY, HH:mm');
        
        return daysAgo;
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

                    { message && (
                        <section className="profileMessage">
                            <h2>{ message }</h2>
                        </section>
                    )}

                    { gameError && <h2>{ gameError }</h2> }
                    { isPending && <Pending text={"Loading reviews..."} /> }
                    { !isPending && games && games.length > 0 && (
                        <>
                            <h1 className="profHead">My reviews</h1>
                            <div className="usersData myReviews">

                                { games.map((game, index) => (
                                    <div className="myReview" key={ index }>
                                        <Link to={`/game/${game._id}`}>
                                            <h2>{ game.title }</h2>
                                        </Link>
                                            
                                        <p>{ game.reviews[0].review }</p>
                                        <h3>Your rating: { game.reviews[0].rating }</h3>
                                        <span>Posted at: { dateFormat(game.reviews[0].createdAt) }</span>
                                    </div>
                                )) }
                            </div>
                        </>
                    ) }
                    
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

                                <div className="profileBtns">
                                    <button className="btnSmall" type="button" onClick={ updatePfp }>Save</button>
                                </div>

                                <label>Change password:</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (8 symbols)"/>
                                <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Repeat password (8 symbols)" />
                            
                                <div className="profileBtns">
                                    <button onClick={() => setUpdateProfile(!updateProfile)}>Cancel</button>
                                    <button type="submit">Update</button>
                                </div>
                            </form>
                        </section>
                    </div>

                    { error && (
                        <section className="profileMessage">
                            <h2>{ error }</h2>
                        </section>
                    )}
                </>
            ) }
        </div>
    );
}
 
export default Profile;