import { faGamepad, faInfoCircle, faNewspaper, faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import AboutCard from "../../components/aboutcard/AboutCard";
import NewGames from "../../components/newgames/NewGames";
import NewNews from "../../components/newnews/NewNews";
import Pending from "../../components/pending/Pending";
import UserList from "../../components/userlist/UserList";
import useFetch from "../../hooks/useFetch";
import "./Home.css";

const Home = () => {
    const { data: posts, isPending, error } = useFetch("/api/posts/last");
    const { data: games, isPending: isPending2, error: error2 } = useFetch("/api/games/publiclast/");
    const { data: users, isPending: isPending3, error: error3 } = useFetch("/api/users/topusers");

    const about = localStorage.getItem("gamerate-display-about");
    const [showAbout, setShowAbout] = useState(about === "false" ? false : true);

    function toggleAbout(val) {
        setShowAbout(val);
        if(val === false){
            localStorage.setItem("gamerate-display-about", false);
        }else{
            localStorage.removeItem("gamerate-display-about");
        }
    }

    return (
        <div className="gameRatePages">
            <h1>Welcome to GameRate</h1>
            
            <div className="homeContents">
                <section className="mainBox">
                    { showAbout && <AboutCard toggleAbout={ toggleAbout } /> }
                    { !showAbout && (
                        <button type="button" onClick={ () => toggleAbout(true) } className="showAbout">
                            <i><FontAwesomeIcon icon={ faInfoCircle } /></i>
                            Show about
                        </button>
                    ) }

                    <h2>
                        <FontAwesomeIcon icon={ faNewspaper } />
                        &nbsp; News posts
                    </h2>
                    { error && <h2>Error...</h2> }
                    { isPending && <Pending text={"Loading..."} /> }
                    { posts && <NewNews posts={ posts } /> }
                </section>

                <aside className="sideBox">
                    <h2>
                        <FontAwesomeIcon icon={ faGamepad } />
                        &nbsp; Recently added games
                    </h2>
                    { error2 && <h2>Error...</h2> }
                    { isPending2 && <Pending text={"Loading..."} /> }
                    { games && <NewGames games={ games } /> }

                    <h2>
                        <FontAwesomeIcon icon={ faRankingStar } />
                        &nbsp; Top 3 ranked users
                    </h2>
                    { error3 && <h2>Error...</h2> }
                    { isPending3 && <Pending text={"Loading..."} /> }
                    { users && <UserList users={ users } /> }
                </aside>
            </div>
        </div>
    );
}
 
export default Home;