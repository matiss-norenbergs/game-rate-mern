import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "./reviewService";

const initialState = {
    isError: false,
    isSuccess: false,
    isPending: false,
    message: ""
}

export const addReview = createAsyncThunk("reviews/create", async (reviewData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await reviewService.addReview(reviewData, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteReview = createAsyncThunk("reviews/delete", async (reviewData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await reviewService.deleteReview(reviewData, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
        .addCase(addReview.pending, (state) => {
            state.isPending = true
        })
        .addCase(addReview.fulfilled, (state, action) => {
            state.isPending = false
            state.isSuccess = true
            state.message = action.payload
        })
        .addCase(addReview.rejected, (state, action) => {
            state.isPending = false
            state.isError = true
            state.message = action.payload
        })

        .addCase(deleteReview.pending, (state) => {
            state.isPending = true
        })
        .addCase(deleteReview.fulfilled, (state, action) => {
            state.isPending = false
            state.isSuccess = true
            state.message = action.payload
        })
        .addCase(deleteReview.rejected, (state, action) => {
            state.isPending = false
            state.isError = true
            state.message = action.payload
        })
    }
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;