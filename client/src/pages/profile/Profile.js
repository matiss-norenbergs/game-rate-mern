import { faDna, faEnvelope, faRankingStar, faStarHalfStroke, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormatDateNum from "../../components/formatdate/FormatDateNum";
import Pending from "../../components/pending/Pending";
import RankCalc from "../../components/rankcalc/RankCalc";
import useFetch from "../../hooks/useFetch";
import "./Profile.css";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { data, isPending, error: gameError } = useFetch(`/api/games/users_reviews/${user._id}`);

    const [games, setGames] = useState([]);
    const [reviewCount, setReviewCount] = useState(0);
    const [positiveRev, setPositiveRev] = useState(0);
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

    const handleDeleteReview = async (gameId, review_id) => {
        const response = await axios.put(`/api/games/deletereview/${gameId}`, { review_id }, config);
        if(response && response.status === 200){
            const newGames = games.filter((game) => game._id !== gameId);
            setGames(newGames);
            
            window.location.reload(false);
        }
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
    
    useEffect(() => {
        if(user){
            setPicture(user.picture);
        }else{
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if(data && !isPending){
            setGames(data.games);
            setReviewCount(data.games.length);
            setPositiveRev(data.positiveReviews);
        }
    }, [data, isPending]);

    return (
        <div className="gameRatePages">
            { user && updateProfile === false ? (
                <>
                    <h1>My profile</h1>

                    <div className="usersData">
                        <section className="userImg">
                            <img src={ require(`../../images/${user.picture}`) } alt="Profile pic" />
                            <h2>{ user.name }</h2>
                        </section>

                        <section className="userInfo">
                            <h2>
                                <i><FontAwesomeIcon icon={ faEnvelope } /></i>
                                Email: { user.email }
                            </h2>
                            <h2>
                                <i><FontAwesomeIcon icon={ faDna } /></i>
                                Role: { user.role }
                            </h2>
                            <h2>
                                <i><FontAwesomeIcon icon={ faStarHalfStroke } /></i>
                                Review count: { reviewCount }
                            </h2>
                            <h2>
                                <i><FontAwesomeIcon icon={ faRankingStar } /></i>
                                Rank: { RankCalc(positiveRev) }
                            </h2>

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
                                        <button className="btnDelete" onClick={ () => handleDeleteReview(game._id, game.reviews[0]._id) } type="button">
                                            <FontAwesomeIcon icon={ faTrashCan } /> Delete
                                        </button>

                                        <Link to={`/game/${game._id}`}>
                                            <h2>{ game.title }</h2>
                                        </Link>
                                            
                                        <p>{ game.reviews[0].review }</p>
                                        <h3>Your rating: { game.reviews[0].rating }</h3>
                                        <span>Posted at: { FormatDateNum(game.reviews[0].createdAt) }</span>
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
                            <form onSubmit={ handleSubmit }>
                                <label>Select picture:</label>
                                <select value={picture} onChange={(e) => setPicture(e.target.value)}>
                                    { profilePics.map((pic, index) => (
                                        <option value={pic.picture} key={index}>{ pic.name }</option>
                                    )) }
                                </select>

                                <div className="profileBtns">
                                    <button className="btnSmall" type="button" onClick={ updatePfp }>Save picture</button>
                                </div>

                                <label>Change password:</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (8 symbols)"/>
                                <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Repeat password (8 symbols)" />
                            
                                <div className="profileBtns">
                                    <button type="button" onClick={() => setUpdateProfile(!updateProfile)}>Cancel</button>
                                    <button type="submit">Update password</button>
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