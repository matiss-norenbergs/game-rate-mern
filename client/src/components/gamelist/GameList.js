import Pagination from "../pagination/Pagination";
import Game from "../game/Game";

const GameList = (props) => {
    const { games, title } = props;

    return (
        <Pagination 
            data={ games }
            RenderComponent={ Game }
            title={ title }
            listClass="gameList"
            pageLimit={ 5 }
            dataLimit={ 18 }
        />
    );
}
 
export default GameList;