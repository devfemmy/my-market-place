import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { OrdersState } from "../../utils/types";
import { getRequest, postRequest, specialPostRequest } from "../../utils/server"




const initialState: OrdersState = {
    sellerOrders: [],
    buyerOrders: [],
    sellerOrderDetails: null,
    outOfStock: null,
    loading: false,
    error: null
}




export const getSellerOrders = createAsyncThunk(
    'orders/getOrders',
    async (payload: any) => {
        const response = await getRequest(`/order?store_id=${payload.id}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getBuyerOrders = createAsyncThunk(
    'orders/getBuyerOrders',
    async () => {
        const response = await getRequest(`/order`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)


export const searchOrder = createAsyncThunk(
    'order/searchOrder',
    async (payload: { search: string, id: string }) => {
        const response = await getRequest(`/sidehustle/orders/searchOrders?searchString=${payload.search}&sidehustleId=${payload.id}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getOutofStocks = createAsyncThunk(
    'orders/getOutofStocks',
    async (payload: any) => {
        const response = await getRequest(`/sidehustle/product/outOfStock?sidehustleId=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getSellerOrderDetail = createAsyncThunk(
    'orders/getOrderDetail',
    async (payload: any) => {
        const response = await getRequest(`/sidehustle/orders/sales/${payload.id}`)

        if (response?.status === 200) {
            const newData = response?.data.data?.find((data: any, i: number) => data?.id === payload?.orderId)
            return newData
        }
    }
)



export const changeOrderStatus = createAsyncThunk(
    'orders/changeOrderStatus',
    async (payload: any, { rejectWithValue }) => {
        try {
        const pd = {
            status: payload?.status,
            reason: payload?.reason
        }
            const response = await postRequest(`/order/update/status?order_item_id=${payload?.orderId}`, pd)
            if (response?.status === 200) {
                const newData = response?.data.data
                return newData
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)



export const rejectAndCancelOrder = createAsyncThunk(
    'orders/rejectAndCancelOrder',
    async (payload: any, { rejectWithValue }) => {
        try {
            const pd = {
                status: payload?.status,
                reason: payload?.reason
            }

            const response = await postRequest(`/order/update/status?order_item_id=${payload?.orderId}`, pd)
            if (response?.status === 200) {
                const newData = response?.data.data
                return newData
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const orderSuccessRate = createAsyncThunk(
    'orders/orderSuccessRate',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await getRequest(`/order/order_success?${payload}}`)
            return response?.data?.data

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)

export const orderSearch = createAsyncThunk(
    'orders/orderSearch',
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await getRequest(`/sidehustle/orders/searchOrders?searchString=${payload.searchValue}&sidehustleId=${payload.id}`)

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)


export const SellerOrderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetData: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(getSellerOrders.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getSellerOrders.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.sellerOrders = action.payload
            })
        builder.addCase(getSellerOrders.rejected, (state, action) => {
            state.loading = false,
                state.sellerOrders = []
            state.error = action.error.message
        }),
            builder.addCase(getBuyerOrders.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getBuyerOrders.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.buyerOrders = action.payload
            })
        builder.addCase(getBuyerOrders.rejected, (state, action) => {
            state.loading = false,
                state.sellerOrders = []
            state.error = action.error.message
        }),
            builder.addCase(searchOrder.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(searchOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.sellerOrders = action.payload
            })
        builder.addCase(searchOrder.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        }),
            builder.addCase(getSellerOrderDetail.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getSellerOrderDetail.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.sellerOrderDetails = action.payload
            })
        builder.addCase(getSellerOrderDetail.rejected, (state, action) => {
            state.loading = false,
                state.sellerOrderDetails = null,
                state.error = action.error.message
        }),
            builder.addCase(changeOrderStatus.pending, (state, action) => {
                // state.loading = true
            }),
            builder.addCase(changeOrderStatus.fulfilled, (state, action: PayloadAction<any>) => {
                // state.loading = false,
                state.sellerOrderDetails = action.payload
            })
        builder.addCase(changeOrderStatus.rejected, (state, action) => {
            // state.loading = false,
            state.error = action.error.message
        }),
            builder.addCase(rejectAndCancelOrder.pending, (state, action) => {
                // state.loading = true
            }),
            builder.addCase(rejectAndCancelOrder.fulfilled, (state, action: PayloadAction<any>) => {
                // state.loading = false,
                state.sellerOrderDetails = action.payload
            })
        builder.addCase(rejectAndCancelOrder.rejected, (state, action) => {
            // state.loading = false,
            state.error = action.error.message
        }),
            builder.addCase(orderSearch.pending, (state, action) => {
                // state.loading = true
            }),
            builder.addCase(orderSearch.fulfilled, (state, action: PayloadAction<any>) => {
                // state.loading = false,
                // state.sellerOrderDetails = action.payload
            })
        builder.addCase(orderSearch.rejected, (state, action) => {
            // state.loading = false,
            state.error = action.error.message
        }),
            builder.addCase(getOutofStocks.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getOutofStocks.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.outOfStock = action.payload
            })
        builder.addCase(getOutofStocks.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        })
        builder.addCase(orderSuccessRate.pending, (state, action) => {
            // state.loading = true
        }),
        builder.addCase(orderSuccessRate.fulfilled, (state, action: PayloadAction<any>) => {
            // state.loading = false,
            // state.sellerOrderDetails = action.payload
        })
    builder.addCase(orderSuccessRate.rejected, (state, action) => {
        // state.loading = false,
        state.error = action.error.message
    })

    }
})

export const sellerOrders = (state: RootState) => state.order.sellerOrders;
export const buyerOrders = (state: RootState) => state.order.buyerOrders;

export const sellerOrderDetails = (state: RootState) => state.order.sellerOrderDetails

export const orderLoader = (state: RootState) => state.order.loading

export const outOfStocks = (state: RootState) => state.order.outOfStock

export const { resetData } = SellerOrderSlice.actions

export default SellerOrderSlice.reducer;