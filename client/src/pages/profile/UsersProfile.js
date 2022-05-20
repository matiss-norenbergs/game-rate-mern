import { faRankingStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router-dom";
import FormatDateNum from "../../components/formatdate/FormatDateNum";
import Pending from "../../components/pending/Pending";
import RankCalc from "../../components/rankcalc/RankCalc";
import useFetch from "../../hooks/useFetch";

const UsersProfile = () => {
    const { id } = useParams();
    const { data: user, isPending, error } = useFetch(`/api/users/user/${id}`);
    const { data: games, isPending: gamePending, error: gameError } = useFetch(`/api/games/users_reviews/${id}`);

    return (
        <div className="gameRatePages">
            { error && <h2>{ error }</h2> }
            { isPending && <Pending text={"Fetching users data..."} /> }
            { !isPending && user && (
                <>
                    <h1>{ user.name }'s profile</h1>

                    <div className="usersData">
                        <section className="userImg">
                            <img src={require(`../../images/${user.picture}`)} alt="Profile pic" />
                            <h2>{ user.name }</h2>
                        </section>

                        <section className="userInfo">
                            <h2>
                                <i><FontAwesomeIcon icon={ faStarHalfStroke } /></i>
                                Review count: { user.reviewCount }
                            </h2>
                            <h2>
                                <i><FontAwesomeIcon icon={ faRankingStar } /></i>
                                Rank: { RankCalc(user.reviewCount) }
                            </h2>
                        </section>
                    </div>
                    
                    { gameError && <h2>{ gameError }</h2> }
                    { gamePending && <Pending text={"Loading reviews..."} /> }
                    { !gamePending && games && games.length > 0 && (
                        <>
                            <h1 className="profHead">{ user.name }'s reviews</h1>
                            <div className="usersData myReviews">

                                { games.map((game, index) => (
                                    <div className="myReview" key={ index }>
                                        <Link to={`/game/${game._id}`}>
                                            <h2>{ game.title }</h2>
                                        </Link>
                                            
                                        <p>{ game.reviews[0].review }</p>
                                        <h3>{ user.name }'s rating: { game.reviews[0].rating }</h3>
                                        <span>Posted at: { FormatDateNum(game.reviews[0].createdAt) }</span>
                                    </div>
                                )) }
                            </div>
                        </>
                    ) }
                </>
            ) }
            { !isPending && !user && (
                <h1>User doesn't exist or isn't available</h1>
            ) }
        </div>
    );
}
 
export default UsersProfile;