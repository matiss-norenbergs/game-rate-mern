import NewGames from "../../components/newgames/NewGames";
import Pending from "../../components/pending/Pending";
import useFetch from "../../hooks/useFetch";
import "./Home.css";

const Home = () => {
    const { data: games, isPending, error } = useFetch("/api/games/publiclast/");

    return (
        <div className="gameRatePages">
            <h1>GameRate start 2 - Matīss Norenbergs</h1>
            <div className="homeContents">
                <section className="newsBox">
                    <h2>News</h2>
                </section>

                <aside className="newAddedGames">
                    <h2>Recently added games...</h2>
                    { isPending && <Pending text={"Loading..."} /> }
                    { error && <h2>Error..</h2> }
                    { games && <NewGames games={games} /> }
                </aside>
            </div>
        </div>
    );
}
 
export default Home;