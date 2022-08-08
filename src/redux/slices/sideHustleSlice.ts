/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { SideHustleState } from "../../utils/types";
import {getRequest, sendPost} from "../../utils/server"
import {Notify} from "../../utils/functions";

const initialState: SideHustleState = {
    allCategories: [],
    loading: true,
    error: null
}

export const getAllCategories = createAsyncThunk(
    'sidehistle/allCategories',
    async () => {
        const response = await getRequest("/sidehustle/category/list")
        if (response?.status === 200) {
            const total = response?.data?.data
            return total
        }
    }
)


export const SideHustleSlice = createSlice({
    name: 'sidehustle',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(getAllCategories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllCategories.fulfilled, (state, action: PayloadAction<any>) => {
            state.allCategories = action.payload
            state.loading = false
        })
        builder.addCase(getAllCategories.rejected, (state, action) => {
            state.error = action.error.message
        })

    }
})

export const allCategories = (state: RootState) => state.sidehustle.allCategories;
export const loading = (state: RootState) => state.sidehustle.loading;
export const error = (state: RootState) => state.sidehustle.error;

export default SideHustleSlice.reducer;