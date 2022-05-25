import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FollowBox.css";

const FollowBox = ({ handleFollowBox, following, followers, showFollowing }) => {
    const [activeFollowing, setActiveFollowing] = useState(true);

    function switchSection(val) {
        setActiveFollowing(val);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        switchSection(showFollowing);
    }, [showFollowing]);

    return (
        <div className="followBox">
            <button onClick={ () => handleFollowBox(false) } className="closeBtn">
                <FontAwesomeIcon icon={ faTimes } />
            </button>

            <section className="followBtns">
                <button onClick={ () => switchSection(true) } className={ activeFollowing ? "active" : "" }>
                    Following
                </button>

                <button onClick={ () => switchSection(false) } className={ !activeFollowing ? "active" : "" }>
                    Followers
                </button>
            </section>

            <div className="innerFollowBox">
                { activeFollowing && 
                    <section className="followSection">
                        { following.length === 0 && 
                            <h3>User is following 0 users...</h3>
                        }
                        { following.map((follow, index) => (
                            <Link to={`/user/${follow._id}`} key={ index } className="userBox">
                                <img 
                                    src={ require(`../../images/${follow.picture}`) } 
                                    alt="Users pic"
                                />
                                <h4>{ follow.name }</h4>
                            </Link>
                        )) }
                    </section>
                }
                    
                { !activeFollowing && 
                    <section className="followSection">
                        { followers.length === 0 &&
                            <h3>No user is following...</h3>
                        }
                        { followers.map((follower, index) => (
                            <Link to={`/user/${follower._id}`} key={ index } className="userBox">
                                <img 
                                    src={ require(`../../images/${follower.picture}`) } 
                                    alt="Users pic"
                                />
                                <h4>{ follower.name }</h4>
                            </Link>
                        )) }
                    </section>
                }
            </div>
        </div>
    );
}
 
export default FollowBox;