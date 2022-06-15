import { Link } from "react-router-dom";
import RankCalc from "../rankcalc/RankCalc";
import "./UserCard.css";

const UserCard = ({ user }) => {
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