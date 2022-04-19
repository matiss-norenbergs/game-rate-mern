import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import "./Game.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Game = () => {
    const { id } = useParams();
    const { data: game, isPending, error } = useFetch(`/api/games/${id}`);

    const [review, setReview] = useState("");
    const [author, setAuthor] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [rating, setRating] = useState(0);

    const { user } = useSelector((state) => state.auth);

    const addReview = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        const reviewData = { review, rating };
        const response = await axios.put(`/api/games/addreview/${id}`, reviewData, config);
        if(response){
            if(response.status === 200){
                window.location.reload(false);
            }else{
                console.log(response);
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(review !== "" && author !== "" && authorId !== "" && rating !== 0){
            addReview();
        }else{
            alert("Fill out all fields!");
        }
    }
    
    const formatPostTime = (datePosted) => {
        const moment = require("moment");
        let timePosted = moment(datePosted).format('MMMM Do YYYY, HH:mm');
        return timePosted;
    }

    useEffect(() => {
        if(user){
            setAuthor(user.name);
            setAuthorId(user._id);
        }
    }, [user]);

    return (
        <div className="gameRatePages">
            { error && <div className="stateInfo"><FontAwesomeIcon className="icon" icon={faExclamationCircle} /> { error }</div> }
            { isPending && <div className="stateInfo">Loading... <FontAwesomeIcon className="icon loading" icon={faSpinner} /></div> }
            { game && isPending === false && error === null && (
                <div className="gameInfo">
                    <h1>{ game.title }</h1>

                    <div className="contents">
                        <img src={ game.cover } alt={ game.title } />
                        <p>{ game.summary }</p>
                    </div>

                    { user && (
                        <form onSubmit={handleSubmit}>
                            <div className="rate">
                                <input onChange={ (e) => setRating(e.target.value) } type="radio" id="star5" name="rate" value="5" />
                                <label htmlFor="star5" title="text">5 stars</label>
                                <input onChange={ (e) => setRating(e.target.value) } type="radio" id="star4" name="rate" value="4" />
                                <label htmlFor="star4" title="text">4 stars</label>
                                <input onChange={ (e) => setRating(e.target.value) } type="radio" id="star3" name="rate" value="3" />
                                <label htmlFor="star3" title="text">3 stars</label>
                                <input onChange={ (e) => setRating(e.target.value) } type="radio" id="star2" name="rate" value="2" />
                                <label htmlFor="star2" title="text">2 stars</label>
                                <input onChange={ (e) => setRating(e.target.value) } type="radio" id="star1" name="rate" value="1" />
                                <label htmlFor="star1" title="text">1 star</label>
                            </div>

                            <textarea value={ review } onChange={ (e) => setReview(e.target.value) } placeholder="Write your review..."></textarea>

                            <button>Submit review</button>
                        </form>
                    ) }

                    { game && game.reviews.length > 0 && (
                        <div className="gameReviews">
                            <h1>{ game.title } reviews & ratings</h1>
                            {game.reviews.map((review, index) => (
                                <div className="review" key={ index }>
                                    <p>{ review.review }</p>
                                    <span>Rating: { review.rating } ★</span>
                                    <h4>Review by: <span>{ review.author }</span></h4>
                                    <h5>{ formatPostTime(review.createdAt) }</h5>
                                </div>
                            ))}
                        </div>
                    ) }
                </div>
            )}
        </div>
    );
}
 
export default Game;