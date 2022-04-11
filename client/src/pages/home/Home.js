import { useEffect } from "react";
import NewGames from "../../components/newgames/NewGames";
import useFetch from "../../hooks/useFetch";
import "./Home.css";

const Home = () => {
    const { data: games, isPending, error } = useFetch("/api/games/publiclast/");

    useEffect(() => {
        console.log(games)
    }, [games])

    return (
        <div className="gameRatePages">
            <h1>GameRate start 2 - Matīss Norenbergs</h1>
            <div className="homeContents">
                <div className="newsBox">
                    <h2>News</h2>
                </div>

                <div className="newAddedGames">
                    <h2>Recently added games...</h2>
                    { isPending && <h2>Loading...</h2> }
                    { error && <h2>Error..</h2> }
                    { games && <NewGames games={games} /> }
                </div>
            </div>
        </div>
    );
}
 
export default Home;