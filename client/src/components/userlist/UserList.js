import { Link } from "react-router-dom";
import RankCalc from "../rankcalc/RankCalc";
import "./UserList.css"

const UserList = (props) => {
    const users = props.users;

    return (
        <div className="topUserList">
            { users.map((user, index) => (
                <Link to={`/user/${user._id}`} key={ index } className="userCard">
                    <section className="imageName">
                        <img src={ require(`../../images/${user.picture}`) } alt={user.picture} />
                        <h2>{ user.name }</h2>
                    </section>

                    <section className="reviewsRank">
                        <h3>
                            Rank: { RankCalc(user.reviewCount) }
                        </h3>
                    </section>
                </Link>
            )) }
        </div>
    );
}
 
export default UserList;