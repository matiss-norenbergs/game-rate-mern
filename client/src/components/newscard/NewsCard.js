import "./NewsCard.css";

const NewsCard = (props) => {
    const { _id, title, text, author, createdAt } = props.data;

    const formatPostTime = (datePosted) => {
        const moment = require("moment");
        let timePosted = moment(datePosted).format('MMMM Do YYYY, HH:mm');
        return timePosted;
    }

    return (
        <div className="newsCard" key={ _id }>
            <h2>{ title }</h2>
            <p>{ text }</p>
            <h4>By: { author }</h4>
            <h5>{ formatPostTime(createdAt) }</h5>
        </div>
    );
}
 
export default NewsCard;