import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store"
import { AddressState } from "../../utils/types";
import { getRequest } from "../../utils/server"




const initialState = {
    storeAnalysis: null,
    viewAnalysis: null,
    activityAnalysis: null,
    walletAnalysis: null,
    productAnalysis: null,
    storeSales: null,
    loading: false,
    error: null
}


export const fetchWalletAnalysis = createAsyncThunk(
    'dashboard/fetchWalletAnalysis',
    async (payload: string) => {
        const response = await getRequest(`/dashboard/wallet_analysis?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const fetchStoreAnalysis = createAsyncThunk(
    'dashboard/fetchStoreAnalysis',
    async (payload: string) => {
        const response = await getRequest(`/dashboard/store_analysis?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const fetchViewAnalysis = createAsyncThunk(
    'dashboard/fetchViewAnalysis',
    async (payload: string) => {
        const response = await getRequest(`/dashboard/views_analysis?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const fetchActivityAnalysis = createAsyncThunk(
    'dashboard/fetchActivityAnalysis',
    async (payload: string) => {
        const response = await getRequest(`/dashboard/activity_analysis?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const fetchStoreSalesAnalysis = createAsyncThunk(
    'dashboard/fetchStoreSalesAnalysis',
    async (payload: string) => {
        const response = await getRequest(`/dashboard/sales_analysis?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const fetchProductAnalysis = createAsyncThunk(
    'dashboard/fetchProductAnalysis',
    async (payload: string) => {
        const response = await getRequest(`/dashboard/top_product_analysis?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)



export const DashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchWalletAnalysis.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(fetchWalletAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.walletAnalysis = action.payload

            }),
            builder.addCase(fetchWalletAnalysis.rejected, (state, action) => {
                state.loading = false

            })
        builder.addCase(fetchStoreAnalysis.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(fetchStoreAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.storeAnalysis = action.payload

            }),
            builder.addCase(fetchStoreAnalysis.rejected, (state, action) => {
                state.loading = false

            })
        builder.addCase(fetchActivityAnalysis.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(fetchActivityAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.activityAnalysis = action.payload

            }),
            builder.addCase(fetchActivityAnalysis.rejected, (state, action) => {
                state.loading = false

            })
        builder.addCase(fetchViewAnalysis.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(fetchViewAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.viewAnalysis = action.payload

            }),
            builder.addCase(fetchViewAnalysis.rejected, (state, action) => {
                state.loading = false

            })
        builder.addCase(fetchStoreSalesAnalysis.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(fetchStoreSalesAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.storeSales = action.payload

            }),
            builder.addCase(fetchStoreSalesAnalysis.rejected, (state, action) => {
                state.loading = false
            })
        builder.addCase(fetchProductAnalysis.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(fetchProductAnalysis.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.productAnalysis = action.payload

            }),
            builder.addCase(fetchProductAnalysis.rejected, (state, action) => {
                state.loading = false
            })
    }
})

export const storeData = (state: RootState) => state.dashboard.storeAnalysis;
export const activityData = (state: RootState) => state.dashboard.activityAnalysis;
export const viewData = (state: RootState) => state.dashboard.viewAnalysis;
export const walletData = (state: RootState) => state.dashboard.walletAnalysis;
export const storeSales = (state: RootState) => state.dashboard.storeSales;
export const productAnalysis = (state: RootState) => state.dashboard.productAnalysis;


export default DashboardSlice.reducer;