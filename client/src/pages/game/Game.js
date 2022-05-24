import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";
import "./Game.css";
import FormatDate from "../../components/formatdate/FormatDate";
import LikeDislike from "../../components/likedislike/LikeDislike";

const Game = () => {
    const { id } = useParams();
    const { data: game, isPending, error } = useFetch(`/api/games/${id}`);
    const { user } = useSelector((state) => state.auth);

    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");

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
                setMessage(response.data.message);
                
                setTimeout(() => {
                    window.location.reload(false);
                }, [1700]);
            }else{
                alert(response);
            }
        }else{
            setMessage("Something went wrong!")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(review !== "" && rating !== 0){
            addReview();
        }else{
            alert("Fill out all fields and provide a rating!");
        }
    }

    return (
        <div className="gameRatePages">
            { error && <div className="stateInfo"><FontAwesomeIcon className="icon" icon={faExclamationCircle} /> { error }</div> }
            { isPending && <Pending text={"Loading..."} /> }
            { game && isPending === false && error === null && (
                <div className="gameInfo">
                    { user && user.role === "admin" && (
                        <Link to={`/admin/game/update/${game._id}`} className="adminEdit">Update</Link>
                    )}

                    <h1>{ game.title }</h1>

                    <div className="contents">
                        <img src={ game.cover } alt={ game.title } />
                        <p>{ game.summary }</p>
                    </div>

                    <h2>Rating: { game.rating } <span className="star">★</span></h2>

                    { game && game.tags && game.tags.length > 0 && (
                        <div className="gameTags">
                            <h2>Tags associated with - { game.title }</h2>
                            
                            <div className="assocTags">
                                { game.tags.map((tag, index) => (
                                    <span key={ index }>{ tag }</span>
                                ))}
                            </div>
                        </div>
                    )}

                    { game.trailer && (
                        <div className="gameTrailer">
                            <h2>Game trailer</h2>

                            <iframe 
                                src={`https://www.youtube.com/embed/${ game.trailer }?playlist=${ game.trailer }&loop=1`} 
                                frameBorder="0"
                                allowFullScreen 
                                title="Game trailer" 
                            />
                        </div>
                    )}

                    { user && (
                        <form onSubmit={ handleSubmit }>
                            { message && <h2 className="reviewMessage">{ message }</h2> }
                            <div className="rate">
                                <input type="radio" id="star5" name="rate" value="5" onChange={ (e) => setRating(e.target.value) } />
                                <label htmlFor="star5" title="text">5 stars</label>
                                
                                <input type="radio" id="star4" name="rate" value="4" onChange={ (e) => setRating(e.target.value) } />
                                <label htmlFor="star4" title="text">4 stars</label>

                                <input type="radio" id="star3" name="rate" value="3" onChange={ (e) => setRating(e.target.value) } />
                                <label htmlFor="star3" title="text">3 stars</label>

                                <input type="radio" id="star2" name="rate" value="2" onChange={ (e) => setRating(e.target.value) } />
                                <label htmlFor="star2" title="text">2 stars</label>

                                <input type="radio" id="star1" name="rate" value="1" onChange={ (e) => setRating(e.target.value) } />
                                <label htmlFor="star1" title="text">1 star</label>
                            </div>

                            <textarea value={ review } onChange={ (e) => setReview(e.target.value) } placeholder="Write your review..." required></textarea>

                            <button>Submit review</button>
                        </form>
                    )}

                    { game && game.reviews && game.reviews.length > 0 && (
                        <div className="gameReviews">
                            <h1>{ game.title } reviews & ratings</h1>
                            { game.reviews.map((review, index) => (
                                <div className="review" key={ index }>
                                    <p>{ review.review }</p>
                                    <span>Rating: { review.rating } <span className="star">★</span></span>
                                    <h4>Review by: <Link className="reviewAuthor" to={`/user/${review.authorId}`}>{ review.author }</Link></h4>
                                    <h5>{ FormatDate(review.createdAt) }</h5>

                                    <LikeDislike
                                        gameId={ id }
                                        reviewId={ review._id }
                                        userId={ user ? user._id : null }
                                        reviewLikes={ review.likes }
                                        reviewDislikes={ review.dislikes }
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
 
export default Game;