import "./NewsList.css";

const NewsList = (props) => {
    const posts = props.posts;
    return (
        <div className="newsList">
            { posts.map((post, index) => (
                <div className="post" key={ index }>
                    <h2>{ post.title }</h2>
                    <p>{ post.text }</p>
                    <h4>By: { post.author }</h4>
                </div>
            )) }
        </div>
    );
}
 
export default NewsList;