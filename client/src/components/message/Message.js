import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Message.css";

const Message = (props) => {
    const { title, message, success } = props;

    return (
        <div className="messageBox">
            <section className="message">
                <h1>{ title }</h1>
                <h2>{ message }</h2>
                { success ?
                    <i className="icon green">
                        <FontAwesomeIcon icon={ faCheck } />
                    </i>
                 :
                    <i className="icon red">
                        <FontAwesomeIcon icon={ faTimes } />
                    </i>
                }
            </section>
        </div>
    );
}
 
export default Message;