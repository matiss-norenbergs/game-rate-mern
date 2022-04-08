import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import gameService from "./gameService";

const initialState = {
    games: [],
    isError: false,
    isSuccess: false,
    isPending: false,
    message: ""
}

//Submit new game
export const submitGame = createAsyncThunk("games/create", async (gameData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await gameService.submitGame(gameData, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const gameSlice = createSlice({
    name: "games",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(submitGame.pending, (state) => {
            state.isPending = true
        })
        .addCase(submitGame.fulfilled, (state, action) => {
            state.isPending = false
            state.isSuccess = true
            state.games.push(action.payload)
        })
        .addCase(submitGame.rejected, (state, action) => {
            state.isPending = false
            state.isError = true
            state.message = action.payload
        })
    }
});

export const { reset } = gameSlice.actions;
export default gameSlice.reducer;