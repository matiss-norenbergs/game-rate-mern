import NewGames from "../../components/newgames/NewGames";
import NewNews from "../../components/newnews/NewNews";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";
import "./Home.css";

const Home = () => {
    const { data: posts, isPending, error } = useFetch("/api/posts/last");
    const { data: games, isPending: isPending2, error: error2 } = useFetch("/api/games/publiclast/");

    return (
        <div className="gameRatePages">
            <h1>Welcome to GameRate</h1>
            
            <div className="homeContents">
                <section className="newsBox">
                    <h2>News posts</h2>
                    { error && <h2>Error...</h2> }
                    { isPending && <Pending text={"Loading..."} /> }
                    { posts && <NewNews posts={ posts } /> }
                </section>

                <aside className="newAddedGames">
                    <h2>Recently added games...</h2>
                    { error2 && <h2>Error...</h2> }
                    { isPending2 && <Pending text={"Loading..."} /> }
                    { games && <NewGames games={ games } /> }
                </aside>
            </div>
        </div>
    );
}
 
export default Home;