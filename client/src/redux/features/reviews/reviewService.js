import axios from "axios";

const API_URL = "/api/review/";

const addReview = async (reviewData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL, reviewData, config);
    return response.data;
}

const deleteReview = async (reviewData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + "delete_review", reviewData, config);
    return response.data;
}

const reviewService = {
    addReview, deleteReview,
}

export default reviewService;