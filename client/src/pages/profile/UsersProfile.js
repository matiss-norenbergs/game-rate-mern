import { faRankingStar, faStarHalfStroke, faThumbsDown, faThumbsUp, faUserGroup, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import FollowBox from "../../components/followbox/FollowBox";
import FormatDateNum from "../../components/formatdate/FormatDateNum";
import Message from "../../components/message/Message";
import Pending from "../../components/pending/Pending";
import RankCalc from "../../components/rankcalc/RankCalc";
import useFetch from "../../hooks/useFetch";

const UsersProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState();
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [showFollowBox, setShowFollowBox] = useState(false);
    const [showFollowing, setShowFollowing] = useState(true);

    const [games, setGames] = useState([]);
    const [positiveRev, setPositiveRev] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    const { id } = useParams();
    const { data: data1, isPending: isPending1, error: error1 } = useFetch(`/api/users/user/${id}`);
    const { data: data2, isPending: isPending2, error: error2 } = useFetch(`/api/games/users_reviews/${id}`);

    const config = user ? {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    } : {};

    function handleFollow() {
        if(!isFollowing){
            axios.put(`/api/follow/follow/${id}`, {}, config)
            .then(res => {
                if(res.data.success){
                    const { name, picture, _id } = user;
                    const newFollowers = followers.concat({ name, picture, _id });
                    setFollowers(newFollowers);
                    setIsFollowing(true);
                }else{
                    alert("Failed to follow user!");
                }
            })
        }else{
            axios.put(`/api/follow/unfollow/${id}`, {}, config)
            .then(res => {
                if(res.data.success){
                    const newFollowers = followers.filter((follower) => follower._id !== user._id);
                    setFollowers(newFollowers);
                    setIsFollowing(false);
                }else{
                    alert("Failed to unfollow user!");
                }
            })
        }
    }

    const handleFollowBox = (showBox, showFollowing) => {
        setShowFollowBox(showBox);
        setShowFollowing(showFollowing);
    }

    useEffect(() => {
        if(!isPending1 && data1.user){
            setUserData(data1.user);
            setFollowing(data1.following);
            setFollowers(data1.followers);

            if(user){
                data1.followers.forEach(follower => {
                    if(follower._id === user._id){
                        setIsFollowing(true);
                    }
                })
            }
        }
    }, [isPending1, data1, user]);

    useEffect(() => {
        if(data2 && data2.games){
            setGames(data2.games);
            setPositiveRev(data2.positiveReviews);
        }
    }, [data2]);

    return (
        <div className="gameRatePages">
            { error1 && <h2>{ error1 }</h2> }
            { isPending1 && <Pending text={"Fetching users data..."} /> }
            { !isPending1 && userData && (
                <>
                    { showFollowBox &&
                        <FollowBox
                            handleFollowBox={ handleFollowBox }
                            following={ following }
                            followers={ followers }
                            showFollowing={ showFollowing }
                        />
                    }

                    <h1>{ userData.name }'s profile</h1>

                    <div className="usersData">
                        <section className="userImg">
                            <img src={require(`../../images/${userData.picture}`)} alt="Profile pic" />
                            <h2>{ userData.name }</h2>
                        </section>

                        <section className="userInfo">
                            <h2>
                                <i><FontAwesomeIcon icon={ faStarHalfStroke } /></i>
                                Review count: { games.length }
                            </h2>
                            <h2>
                                <i><FontAwesomeIcon icon={ faRankingStar } /></i>
                                Rank: { RankCalc(positiveRev) }
                            </h2>
                            <h2 className="infoBtn" onClick={ () => handleFollowBox(true, true) }>
                                <i><FontAwesomeIcon icon={ faUserGroup } /></i>
                                Following: { following.length }
                            </h2>
                            <h2 className="infoBtn" onClick={ () => handleFollowBox(true, false) }>
                                <i><FontAwesomeIcon icon={ faUsers } /></i>
                                Followers: { followers.length }
                            </h2>

                            { user && user._id !== id && 
                                <div className="profileBtns">
                                    { 
                                        <button onClick={() => handleFollow()} className={ isFollowing ? "btnActive" : "" }>
                                            { !isFollowing ? "Follow" : "Unfollow" }
                                        </button>
                                    }
                                </div>
                            }
                        </section>
                    </div>
                    
                    { error2 && <h2>{ error2 }</h2> }
                    { isPending2 && <Pending text={"Loading reviews..."} /> }
                    { !isPending2 && games && games.length > 0 && (
                        <>
                            <h1 className="profHead">{ userData.name }'s reviews</h1>
                            <div className="usersData myReviews">

                                { games.map((game, index) => (
                                    <div className="myReview" key={ index }>
                                        <Link to={`/game/${game._id}`}>
                                            <h2>{ game.title }</h2>
                                        </Link>
                                            
                                        <p>{ game.reviews[0].review }</p>
                                        <h3>{ userData.name }'s rating: { game.reviews[0].rating }</h3>

                                        <div className="myReviewLikes">
                                            <h4><FontAwesomeIcon icon={ faThumbsUp } /> { game.reviews[0].likes.length }</h4>|
                                            <h4><FontAwesomeIcon icon={ faThumbsDown } /> { game.reviews[0].dislikes.length }</h4>
                                        </div>

                                        <span>Posted at: { FormatDateNum(game.reviews[0].createdAt) }</span>
                                    </div>
                                )) }
                            </div>
                        </>
                    ) }
                </>
            ) }
            { !isPending1 && !data1.user && (
                <Message
                    title={"Something went wrong!"}
                    message={"User doesn't exist or isn't available"}
                    success={ false }
                />
            ) }
        </div>
    );
}
 
export default UsersProfile;