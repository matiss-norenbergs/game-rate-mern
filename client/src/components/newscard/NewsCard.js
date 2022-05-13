import FormatDate from "../formatdate/FormatDate";
import "./NewsCard.css";

const NewsCard = (props) => {
    const { _id, title, text, author, createdAt } = props.data;

    return (
        <div className="newsCard" key={ _id }>
            <h2>{ title }</h2>
            <p>{ text }</p>
            <h4>By: { author }</h4>
            <h5>{ FormatDate(createdAt) }</h5>
        </div>
    );
}
 
export default NewsCard;