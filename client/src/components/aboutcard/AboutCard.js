import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./AboutCard.css";

const AboutCard = ({ toggleAbout }) => {

    return (
        <div className="aboutCard">
            <h2><FontAwesomeIcon icon={ faInfoCircle } /> About GameRate</h2>

            <p>
                GameRate is an application made for rating games, which can provide information to other users about games that they possibly might want to try out and could give them an idea about it before hand. Users of GameRate can register which will grant them the following privileges. Registered users can submit games that they would like to see on this app. Users also will be able to rate the game they have submitted or other games that are visible to them by giving their thoughts about the game and also providing a rating out of 5 stars. Once user has submitted a game they have to wait until it's approved by an administrator, so it would be added to GameRate library. Each user has a rank, which is determined by the amount of reviews the user has written.
            </p>

            <button type="button" onClick={ () => toggleAbout(false) }>Hide about</button>
        </div>
    );
}
 
export default AboutCard;