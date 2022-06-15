import "./StarRating.css";

const StarRating = ({ rating }) => {

    const ratingWidth = (rating) => {
        const width = rating * 20 + "%";
        return width;
    }

    return (
        <div className="starRating">
            <div className="currentRating">
                <div className="star-ratings">
                    <div className="fill-ratings" style={{ width: ratingWidth(rating) }}>
                        <span>★★★★★</span>
                    </div>

                    <div className="empty-ratings">
                        <span>★★★★★</span>
                    </div>
                </div>

                { rating > 0 ? <h2>{ rating } stars</h2> : <h2>No rating</h2> }
            </div>
        </div>
    );
}
 
export default StarRating;