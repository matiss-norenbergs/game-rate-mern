import Pagination from "../pagination/Pagination";
import GameCard from "../gamecard/GameCard";

const GameList = (props) => {
    const { games, title } = props;

    return (
        <Pagination 
            data={ games }
            RenderComponent={ GameCard }
            title={ title }
            listClass="gameList"
            pageLimit={ 5 }
            dataLimit={ 18 }
        />
    );
}
 
export default GameList;