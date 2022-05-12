import NewsCard from "../newscard/NewsCard";
import Pagination from "../pagination/Pagination";

const NewsList = (props) => {
    const { news, title } = props;

    return (
        <Pagination
            data={ news }
            RenderComponent={ NewsCard }
            title={ title }
            listClass="newsList"
            pageLimit={ 5 }
            dataLimit={ 5 }
        />
    );
}
 
export default NewsList;