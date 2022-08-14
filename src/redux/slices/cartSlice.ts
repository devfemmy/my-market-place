/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { CartFormData } from "../../utils/types";
import {getRequest, sendPost} from "../../utils/server"
import {Notify} from "../../utils/functions";

const initialState: CartFormData = {
    cart: [],
    loading: true,
    error: null
}

export const getCart = createAsyncThunk(
    'cart/getCart',
    async () => {
        const response = await getRequest("/sidehustle/cart")
        if (response?.status === 200) {
            const total = response?.data?.data
            return total
        }
    }
)


export const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCart.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getCart.fulfilled, (state, action: PayloadAction<any>) => {
            state.cart = action.payload
            state.loading = false
        })
        builder.addCase(getCart.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const cart = (state: RootState) => state.cart.cart;
export const loading = (state: RootState) => state.cart.loading;
export const error = (state: RootState) => state.cart.error;

export default CartSlice.reducer;