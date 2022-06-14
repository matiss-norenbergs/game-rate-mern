import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import RankCalc from "../rankcalc/RankCalc";
import "./UserCard.css";

const UserCard = ({ user }) => {
    const [positiveRev, setPositiveRev] = useState(0);
    const { data, isPending, error } = useFetch(`/api/games/users_reviews/${user._id}`);

    useEffect(() => {
        if(!isPending && !error && data){
            setPositiveRev(data.positiveReviews);
        }
    }, [data, isPending, error]);

    return (
        <Link to={`/user/${user._id}`} className="userCard">
            <section className="imageName">
                <img src={ require(`../../images/${user.picture}`) } alt={user.picture} />
                <h2>{ user.name }</h2>
            </section>

            <section className="reviewsRank">
                <h3>
                    Rank: { RankCalc(user.positiveReviews.length) }
                </h3>
            </section>
        </Link>
    );
}
 
export default UserCard;