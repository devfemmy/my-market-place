import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { CartState } from "../../utils/types";
import { deleteRequestNoPayload, getRequest, postAuthRequest, postRequest, specialPostRequest } from "../../utils/server"




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
            const response = await postRequest(`/cart/create`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async (payload: {quantity: string, id: string}, { rejectWithValue }) => {
        const pDay = {
            quantity: payload?.quantity
        }
        try {
            const response = await postRequest(`/cart/update?cart_id=${payload?.id}`, pDay)
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
            const response = await postRequest(`/order/create`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const getDeliveryFeeData = createAsyncThunk(
    'cart/getDeliveryFeeData',
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/order/checkout`, payload)
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
            const response = await deleteRequestNoPayload(`/cart/delete?cart_id=${payload}`)
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
                state.loading = false,
                    state.carts = action.payload
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
            builder.addCase(getDeliveryFeeData.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getDeliveryFeeData.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            }),
            builder.addCase(getDeliveryFeeData.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            })
    }
})

export const CartData = (state: RootState) => state.cart.carts;

export default CartSlice.reducer;
