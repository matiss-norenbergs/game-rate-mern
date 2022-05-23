import axios from "axios";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./LikeDislike.css";

const LikeDislike = ({ gameId, reviewId, userId, reviewLikes, reviewDislikes }) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const config = user ? {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    } : {};

    useEffect(() => {
        setLikes(reviewLikes.length);
        setDislikes(reviewDislikes.length);

        if(user){
            reviewLikes.forEach(like => {
                if(like === user._id){
                    setIsLiked(true);
                }
            });
            reviewDislikes.forEach(dislike => {
                if(dislike === user._id){
                    setIsDisliked(true);
                }
            })
        }
    }, [reviewLikes, reviewDislikes, user]);

    const handleLike = () => {
        if(!isLiked){
            axios.put(`/api/like/likeInc/${gameId}/${reviewId}`, {}, config)
            .then(res => {
                if(res.data.success){
                    setLikes(likes + 1);
                    setIsLiked(true);

                    if(isDisliked){
                        setIsDisliked(false);
                        setDislikes(dislikes - 1);
                    }
                }else{
                    alert("Failed to like the review!");
                }
            })
        }else{
            axios.put(`/api/like/likeDec/${gameId}/${reviewId}`, {}, config)
            .then(res => {
                if(res.data.success){
                    setLikes(likes - 1);
                    setIsLiked(false);
                }else{
                    alert("Failed to unlike the review!");
                }
            })
        }
    }

    const handleDislike = () => {
        if(!isDisliked){
            axios.put(`/api/like/dislikeInc/${gameId}/${reviewId}`, {}, config)
            .then(res => {
                if(res.data.success){
                    setDislikes(dislikes + 1);
                    setIsDisliked(true);

                    if(isLiked){
                        setIsLiked(false);
                        setLikes(likes - 1);
                    }
                }else{
                    alert("Failed to dislike the review!");
                }
            })
        }else{
            axios.put(`/api/like/dislikeDec/${gameId}/${reviewId}`, {}, config)
            .then(res => {
                if(res.data.success){
                    setDislikes(dislikes - 1);
                    setIsDisliked(false);
                }else{
                    alert("Failed to undislike the review!");
                }
            })
        }
    }

    return (
        <section className="likeDislikeBox">
            <button type="button" onClick={ handleLike } className={ isLiked ? "activeLikesBtn" : "" }>
                <FontAwesomeIcon icon={ faThumbsUp } /> { likes }
            </button>

            <button type="button" onClick={ handleDislike } className={ isDisliked ? "activeLikesBtn" : "" }>
                <FontAwesomeIcon icon={ faThumbsDown } /> { dislikes }
            </button>
        </section>
    );
}
 
export default LikeDislike;