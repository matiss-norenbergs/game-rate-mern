import { faRankingStar, faStarHalfStroke, faUserGroup, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import FormatDateNum from "../../components/formatdate/FormatDateNum";
import Pending from "../../components/pending/Pending";
import RankCalc from "../../components/rankcalc/RankCalc";
import useFetch from "../../hooks/useFetch";

const UsersProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const [games, setGames] = useState([]);
    const [reviewCount, setReviewCount] = useState(0);
    const [positiveRev, setPositiveRev] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    const { id } = useParams();
    const { data: data1, isPending: isPending1, error: error1 } = useFetch(`/api/users/user/${id}`);
    const { data: data2, isPending: isPending2, error: error2 } = useFetch(`/api/games/users_reviews/${id}`);

    async function followUser() {
        
    }

    async function unfollowUser() {
        
    }

    useEffect(() => {
        if(data2){
            setGames(data2.games);
            setReviewCount(data2.games.length);
            setPositiveRev(data2.positiveReviews);
        }
    }, [data2]);

    return (
        <div className="gameRatePages">
            { error1 && <h2>{ error1 }</h2> }
            { isPending1 && <Pending text={"Fetching users data..."} /> }
            { !isPending1 && data1 && (
                <>
                    <h1>{ data1.name }'s profile</h1>

                    <div className="usersData">
                        <section className="userImg">
                            <img src={require(`../../images/${data1.picture}`)} alt="Profile pic" />
                            <h2>{ data1.name }</h2>
                        </section>

                        <section className="userInfo">
                            <h2>
                                <i><FontAwesomeIcon icon={ faUserGroup } /></i>
                                Following: { data1.following.length }
                            </h2>

                            <h2>
                                <i><FontAwesomeIcon icon={ faUsers } /></i>
                                Followers: { data1.followers.length }
                            </h2>

                            <h2>
                                <i><FontAwesomeIcon icon={ faStarHalfStroke } /></i>
                                Review count: { reviewCount }
                            </h2>

                            <h2>
                                <i><FontAwesomeIcon icon={ faRankingStar } /></i>
                                Rank: { RankCalc(positiveRev) }
                            </h2>

                            { user && user._id !== id && 
                                <div className="profileBtns">
                                    { !isFollowing && <button onClick={() => followUser()}>Follow</button> }
                                    { isFollowing && <button onClick={() => unfollowUser()}>Unfollow</button> }
                                </div>
                            }
                        </section>
                    </div>
                    
                    { error2 && <h2>{ error2 }</h2> }
                    { isPending2 && <Pending text={"Loading reviews..."} /> }
                    { !isPending2 && games && games.length > 0 && (
                        <>
                            <h1 className="profHead">{ data1.name }'s reviews</h1>
                            <div className="usersData myReviews">

                                { games.map((game, index) => (
                                    <div className="myReview" key={ index }>
                                        <Link to={`/game/${game._id}`}>
                                            <h2>{ game.title }</h2>
                                        </Link>
                                            
                                        <p>{ game.reviews[0].review }</p>
                                        <h3>{ data1.name }'s rating: { game.reviews[0].rating }</h3>
                                        <span>Posted at: { FormatDateNum(game.reviews[0].createdAt) }</span>
                                    </div>
                                )) }
                            </div>
                        </>
                    ) }
                </>
            ) }
            { !isPending1 && !data1 && (
                <h1>User doesn't exist or isn't available</h1>
            ) }
        </div>
    );
}
 
export default UsersProfile;