import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { ProductState } from "../../utils/types";
import { sendPost, getRequest } from "../../utils/server"

const initialState: ProductState = {
    myProducts: [],
    images: ["", "", "", "", "", ""],
    categories: [],
    loading: false,
    error: null
}

export const addImage = createAsyncThunk(
    'product/images',
    async (payload: {index: number, uri: string}) => {
        return payload
    }
)

export const resetImage = createAsyncThunk(
    'product/resetimages',
    async () => {
        return ["", "", "", "", "", ""]
    }
)

export const ProductSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addImage.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(addImage.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.images[action.payload.index] = action.payload.uri
        })
        builder.addCase(addImage.rejected, (state, action) => {
            state.error = action.error.message
        })

        builder.addCase(resetImage.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(resetImage.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.images = action.payload
        })
        builder.addCase(resetImage.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const images = (state: RootState) => state.product.images;

export default ProductSlice.reducer;