import NewsList from "../../components/newslist/NewsList";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";

const News = () => {
    const { data: news, isPending, error } = useFetch("/api/posts/");

    return (
        <div className="gameRatePages">
            { error && <h2>Error: { error }</h2> }
            { isPending && <Pending text={"Loading posts..."} /> }
            { !isPending && <NewsList news={ news } title={"Game news"} /> }
        </div>
    );
}
 
export default News;