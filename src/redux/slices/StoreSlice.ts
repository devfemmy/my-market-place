import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { StoreState, StoreCreateFormData } from "../../utils/types";
import { sendPost, getRequest } from "../../utils/server"




const initialState: StoreState = {
    myStore: [],
    allStores: [],
    loading: false,
    error: null
}



export const createStore = createAsyncThunk(
    'store/createStore',
    async (payload: StoreCreateFormData) => {
        const response = await sendPost("/sidehustle/account/create", payload)
    }
)



export const getPersonalStore = createAsyncThunk(
    'store/myStore',
    async () => {
        const response = await getRequest("/sidehustle/account")
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)


export const getAllStore = createAsyncThunk(
    'store/allStore',
    async () => {
        const response = await getRequest("/sidehustle/category")
        if (response?.status === 200) {
            return response?.data?.data
        }

    }
)

export const StoreSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createStore.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(createStore.fulfilled, (state, action) => {
                state.loading = false
            }),
            builder.addCase(createStore.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload
            }),
            builder.addCase(getPersonalStore.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getPersonalStore.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.myStore = action.payload
            })
        builder.addCase(getPersonalStore.rejected, (state, action) => {
            state.error = action.error.message
        })
        builder.addCase(getAllStore.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getAllStore.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.allStores = action.payload
            })
        builder.addCase(getAllStore.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const myStore = (state: RootState) => state.store.myStore;

export const allStores = (state: RootState) => state.store.allStores;

export default StoreSlice.reducer;