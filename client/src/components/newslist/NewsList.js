import "./NewsList.css";

const NewsList = (props) => {
    const posts = props.posts;

    const formatPostTime = (datePosted) => {
        const moment = require("moment");
        let timePosted = moment(datePosted).format('MMMM Do YYYY, HH:mm');
        return timePosted;
    }

    return (
        <div className="newsList">
            { posts.map((post, index) => (
                <div className="post" key={ index }>
                    <h2>{ post.title }</h2>
                    <p>{ post.text }</p>
                    <h4>By: { post.author }</h4>
                    <h5>{ formatPostTime(post.createdAt) }</h5>
                </div>
            )) }
        </div>
    );
}
 
export default NewsList;