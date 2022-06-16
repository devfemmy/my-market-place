import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { StoreState, StoreCreateFormData } from "../../utils/types";
import { sendPost, getRequest } from "../../utils/server"




const initialState: StoreState = {
    myStore: [],
    allStores: [],
    allCategories: [],
    permission: [{value: 'View Store Details', bool: false}, {value: 'View Store Analysis', bool: false}, {value: 'Manage Store Locations', bool: false}, {value: 'Manage shipping fee', bool: false}],
    loading: false,
    error: null
}



export const createStore = createAsyncThunk(
    'store/createStore',
    async (payload: StoreCreateFormData) => {
        const response = await sendPost("/sidehustle/account/create", payload)
    }
)

export const getStorePermission = createAsyncThunk(
    'store/storePermission',
    async (payload: string) => {
        if(payload == 'Store Owner'){
            return [{value: 'View Store Details', bool: true}, {value: 'View Store Analysis', bool: true}, {value: 'Manage Store Locations', bool: true}, {value: 'Manage shipping fee', bool: true}]
        }
        else if(payload == 'Store Manager'){
            return [{value: 'View Store Details', bool: true}, {value: 'View Store Analysis', bool: true}, {value: 'Manage Store Locations', bool: false}, {value: 'Manage shipping fee', bool: true}]
        }
        else{
            return [{value: 'View Store Details', bool: true}, {value: 'View Store Analysis', bool: true}, {value: 'Manage Store Locations', bool: false}, {value: 'Manage shipping fee', bool: false}]
        }
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

export const getAllCategories = createAsyncThunk(
    'store/allCategories',
    async () => {
        const response = await getRequest("/sidehustle/category")
        if (response?.status === 200) {
            const arr = response?.data?.data
            const categories = arr.map(function(val: any){
                return val.category
            })
            return categories
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

        builder.addCase(getStorePermission.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(getStorePermission.fulfilled, (state, action) => {
            state.loading = false
            state.permission = action.payload
        }),
        builder.addCase(getStorePermission.rejected, (state, action) => {
            state.error = action.error.message
        }),

        builder.addCase(getAllCategories.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(getAllCategories.fulfilled, (state, action) => {
            state.loading = false
            state.allCategories = action.payload
        }),
        builder.addCase(getAllCategories.rejected, (state, action) => {
            state.error = action.error.message
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

export const permission = (state: RootState) => state.store.permission;

export const allCategories = (state: RootState) => state.store.allCategories;

export default StoreSlice.reducer;