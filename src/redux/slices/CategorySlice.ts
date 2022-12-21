import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { CategoryState } from "../../utils/types";
import { getRequest, getRequestNoToken } from "../../utils/server"




const initialState: CategoryState = {
    category: [],
    storeBySlug: null,
    storeByCategory: null,
    loading: false,
    error: null
}


export const getAllCategories = createAsyncThunk(
    'category/getAllCategories',
    async () => {
        const response = await getRequestNoToken(`/category`)
        if (response?.status === 200) {
            return response?.data?.data
        }
        else {
            console.log({response})
        }
    }
)

export const getByCategories = createAsyncThunk(
    'category/getByCategories',
    async (payload: string) => {
        // const response = await getRequest(`/sidehustle/category/${payload}`)
        // if (response?.status === 200) {
        //     return response?.data?.data
        // }
    }
)

export const getStoreBySlug = createAsyncThunk(
    'category/getStoreBySlug',
    async (payload: string) => {
        const response = await getRequest(`/store/seller?slug=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getStoreBySlugBuyer = createAsyncThunk(
    'category/getStoreBySlug',
    async (payload: string) => {
        const response = await getRequest(`/store?slug=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)






export const CategorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCategories.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getAllCategories.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.category = action.payload
            })
        builder.addCase(getAllCategories.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        }),
        builder.addCase(getByCategories.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getByCategories.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.storeByCategory = action.payload
            })
        builder.addCase(getByCategories.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        }),
        builder.addCase(getStoreBySlug.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getStoreBySlug.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.storeBySlug = action.payload
            })
        builder.addCase(getStoreBySlug.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        })
    }
})

export const categoryData = (state: RootState) => state.category.category;
export const storeBySlug = (state: RootState) => state.category.storeBySlug;
export const storeByCategory = (state: RootState) => state.category.storeByCategory;


export default CategorySlice.reducer;