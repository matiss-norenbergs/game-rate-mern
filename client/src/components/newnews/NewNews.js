import FormatDate from "../formatdate/FormatDate";
import "./NewNews.css";

const NewNews = (props) => {
    const posts = props.posts;

    return (
        <div className="newNews">
            { posts.map((post, index) => (
                <div className="post" key={ index }>
                    <h2>{ post.title }</h2>
                    <p>{ post.text }</p>
                    <h4>By: { post.author }</h4>
                    <h5>{ FormatDate(post.createdAt) }</h5>
                </div>
            )) }
        </div>
    );
}
 
export default NewNews;