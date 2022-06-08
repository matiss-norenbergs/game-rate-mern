import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReview, reset } from "../../redux/features/reviews/reviewSlice";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";
import FormatDate from "../../components/formatdate/FormatDate";
import LikeDislike from "../../components/likedislike/LikeDislike";
import "./Game.css";

const Game = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data, isPending: gameIsPending, error } = useFetch(`/api/games/${id}`);
    const { user } = useSelector((state) => state.auth);
    const { isError, isSuccess, isPending, message } = useSelector((state) => state.reviews);

    const [game, setGame] = useState();
    const [hasReview, setHasReview] = useState(false);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);

    const handleSubmitReview = (e) => {
        e.preventDefault();

        if(review !== "" && rating !== 0){
            dispatch(addReview({ id, review, rating }));
        }else{
            alert("Fill out all fields and provide a rating!");
        }
    }

    useEffect(() => {
        if(!isPending && isSuccess){
            setTimeout(() => {
                dispatch(reset());
                window.location.reload(false);
            }, [1700]);
        }else if(!isPending && isError){
            setTimeout(() => {
                dispatch(reset());
            }, [2000]);
        }
    }, [isError, isPending, isSuccess, dispatch]);

    useEffect(() => {
        if(data){
            setGame(data);
            if(user && data.reviews.length > 0){
                data.reviews.forEach(review => {
                    if(review.authorId === user._id){
                        setHasReview(true);
                    }
                })
            }
        }
    }, [data, user]);

    return (
        <div className="gameRatePages">
            { error && <div className="stateInfo"><FontAwesomeIcon className="icon" icon={faExclamationCircle} /> { error }</div> }
            { gameIsPending && <Pending text={"Loading..."} /> }
            { game && !gameIsPending && !error && (
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

                    { user && user.role !== "suspended" && !hasReview && (
                        <form onSubmit={ handleSubmitReview }>
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
                                        reviewLikes={ review.likes }
                                        reviewDislikes={ review.dislikes }
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            { !gameIsPending && !data && (
                <h1>Game not found!</h1>
            ) }
        </div>
    );
}
 
export default Game;