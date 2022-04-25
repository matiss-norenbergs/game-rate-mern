import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Pending.css";

const Pending = (props) => {
    const { text, center, size } = props;
    return (
        <div className={ center ? "pendingMessage center" : "pendingMessage" }>
            <h2 style={{fontSize: size}}>{ text }</h2>
            <FontAwesomeIcon icon={ faSpinner } className="pendingIcon" />
        </div>
    );
}
 
export default Pending;