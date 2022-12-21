import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { PayoutBody, PayoutState, ProfileState, WishlistState } from "../../utils/types";
import { bankVerification, deleteRequestNoPayload, getRequest, postAuthRequest, postRequest, specialGetRequest, specialPostRequest } from "../../utils/server"





const initialState: WishlistState = {
    lists: null,
    loading: false,
    error: null
}



export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async () => {
        const response = await getRequest(`/wishlist`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)


export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (payload: any, { rejectWithValue }) => {

        try {
            const response = await postRequest(`/wishlist`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (payload: any, { rejectWithValue }) => {

        try {
            const response = await deleteRequestNoPayload(`/wishlist?wishlist_item_id=${payload?.id}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e:any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)





export const WishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getWishlist.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getWishlist.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                state.lists = action.payload
            })
        builder.addCase(getWishlist.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        }),
            builder.addCase(addToWishlist.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(addToWishlist.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                state.lists = [...state.lists, action.payload]
            })
        builder.addCase(addToWishlist.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        })
        builder.addCase(removeFromWishlist.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                state.lists = action.payload
            })
        builder.addCase(removeFromWishlist.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        })
    }
})

export const wishlistData = (state: RootState) => state.wishlist.lists;


export default WishlistSlice.reducer;