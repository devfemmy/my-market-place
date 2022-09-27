import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { CartState } from "../../utils/types";
import {getRequest, sendPost, sendDelete} from "../../utils/server"



const initialState: CartState = {
    carts: [],
    loading: false,
    error: null
}


export const getCarts = createAsyncThunk(
    'cart/getCarts',
    async () => {
        const response = await getRequest(`/cart`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await sendPost(`/cart/create`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            console.log(e?.response?.data)
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async (payload: any, { rejectWithValue }) => {
        const pDay = {
            quantity: payload?.quantity
        }
        try {
            const response = await sendPost(`/cart/update?cart_id=${payload?.id}`, pDay)
            if (response?.status === 200) {
                return response?.data?.data
            }

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const cartCheckout = createAsyncThunk(
    'cart/cartCheckout',
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await sendPost(`/sidehustle/orders/checkout`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const deleteCart = createAsyncThunk(
    'cart/deleteCart',
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await sendDelete(`/cart/delete?cart_id=${payload}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)



export const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
            builder.addCase(getCarts.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getCarts.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                state.carts = action.payload
            }),
            builder.addCase(getCarts.rejected, (state, action) => {
                state.loading = false,
                state.carts = []
                state.error = action.error.message
            }),


            builder.addCase(addToCart.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(addToCart.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            }),
            builder.addCase(addToCart.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            }),


            builder.addCase(updateCart.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(updateCart.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            }),
            builder.addCase(updateCart.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            }),

            
            builder.addCase(deleteCart.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(deleteCart.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.carts = []
            }),
            builder.addCase(deleteCart.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            })
    }
})

export const CartData = (state: RootState) => state.cart.carts;
export const loading = (state: RootState) => state.cart.loading;
export const error = (state: RootState) => state.cart.error;

export default CartSlice.reducer;