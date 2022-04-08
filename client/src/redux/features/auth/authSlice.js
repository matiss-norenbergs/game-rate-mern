import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isPending: false,
    message: ""
};

//Register user
export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
    try {
        return await authService.register(user);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

//Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
});

//Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try {
        return await authService.login(user);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        reset: (state) => {
            state.isPending = false
            state.isSuccess = false
            state.isError = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isPending = true
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isPending = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(register.rejected, (state, action) => {
            state.isPending = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(login.pending, (state) => {
            state.isPending = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isPending = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(login.rejected, (state, action) => {
            state.isPending = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null
        })
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;