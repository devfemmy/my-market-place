import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";





export const SampleSlice = createSlice({
    name: 'post',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
       
    }
})

export const sampleState = (state: RootState) => state.posts.postData;

export default SampleSlice.reducer;