import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { StoreState, StoreCreateFormData, StoreUpdateFormData } from "../../utils/types";
import { postRequest, getRequest, uploadImageFunc, deleteRequestNoPayload } from "../../utils/server"




const initialState: StoreState = {
    myStore: [],
    storeRatings: [],
    allStores: [],
    storeById: null,
    loading: false,
    error: null,
    wallet: null,
}



export const createStore = createAsyncThunk(
    'store/createStore',
    async (payload: StoreCreateFormData, { rejectWithValue }) => {
        const data = {
            brand_name: payload.brandName,
            description: payload.description,
            city: payload.location.city,
            street: payload.location.street,
            img_url: payload.coverImg,
            state: payload.location.state,
            phone_number: payload.phoneNumber,
            // estimated_delivery_duration: payload.estimated_delivery_duration
        }
        try {
            const response = await postRequest("/store/create", data)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const updateStore = createAsyncThunk(
    'store/updateStore',
    async (payload: StoreUpdateFormData, { rejectWithValue }) => {
        const payloadData = {
            brand_name: payload.brandName,
            description: payload.description,
            city: payload.location.city,
            street: payload.location.street,
            img_url: payload.coverImg,
            state: payload.location.state,
            phone_number: payload.phoneNumber,
            // estimated_delivery_duration: payload?.estimated_delivery_duration
        }

        try {
            const response = await postRequest(`/store/update/?store_id=${payload.id}`, payloadData)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const storeWallet = createAsyncThunk(
    'store/wallet',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await getRequest(`/wallet?store_id=${payload}`)
            if (response?.status === 200) {
                return response.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const activateStore = createAsyncThunk(
    'store/activateStore',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/store/activate/?store_id=${payload}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const deactivateStore = createAsyncThunk(
    'store/deactivateStore',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/store/deactivate?store_id=${payload}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            rejectWithValue(e?.response?.data?.message)
        }
    }
)



export const getPersonalStore = createAsyncThunk(
    'store/myStore',
    async () => {
        const response = await getRequest("/store/seller")
        if (response?.status === 200) {
            return response?.data?.data
        }
        else {
            return []
        }
    }
)

export const getStoreById = createAsyncThunk(
    'store/getStoreById',
    async (payload: string) => {
        // const response = await getRequest(`/store/getById/${payload}`)
        // if (response?.status === 200) {
        //     return response?.data?.data
        // }
    }
)

export const deleteStoreById = createAsyncThunk(
    'store/deleteStoreById',
    async (payload: string, { rejectWithValue }) => {
        const response = await deleteRequestNoPayload(`/store/delete?store_id=${payload}`)
        try {
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const deleteAccount = createAsyncThunk(
    'store/deleteAccount',
    async (payload: string) => {
        const response = await deleteRequestNoPayload(`/store/delete?store_id=${payload}`)
        postRequest(`/auth/delete-account`)
        try {
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
           console.log(e?.response?.data?.message)
        }
    }
)



export const getAllStore = createAsyncThunk(
    'store/allStore',
    async () => {
        const response = await getRequest("/store/all")
        if (response?.status === 200) {
            return response?.data?.data
        }

    }
)

export const getAllStoreBySlugBuyer = createAsyncThunk(
    'store/allStoreBySlugBuyer',
    async (payload: string) => {
        const response = await getRequest(`/store?slug=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }

    }
)

export const getStoreRating = createAsyncThunk(
    'store/getStoreRating',
    async (payload: string) => {
        const response = await getRequest(`/sidehustle/rate/ratings?sidehustleId=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }

    }
)


export const uploadImage = createAsyncThunk(
    'store/upload',
    async (payload: any, { rejectWithValue }) => {
        const response = await uploadImageFunc(payload)
        try {
            if (response?.status === 200) {
                return response?.data?.data?.url
            }
        }
        catch (e: any) {
            rejectWithValue(e?.response?.data?.message)
        }
    }
)




export const StoreSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createStore.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(createStore.fulfilled, (state, action) => {
                state.loading = false,
                    state.storeById = action.payload

            }),
            builder.addCase(createStore.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
            builder.addCase(updateStore.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(updateStore.fulfilled, (state, action) => {
                state.loading = false
            }),
            builder.addCase(updateStore.rejected, (state, action) => {
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
        builder.addCase(getAllStoreBySlugBuyer.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getAllStoreBySlugBuyer.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                   
            })
        builder.addCase(getAllStoreBySlugBuyer.rejected, (state, action) => {
            state.error = action.error.message
        })
        builder.addCase(uploadImage.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(uploadImage.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            })
        builder.addCase(uploadImage.rejected, (state, action) => {
            state.error = action.error.message
        }),
            builder.addCase(getStoreById.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getStoreById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.storeById = action.payload
            })
        builder.addCase(getStoreById.rejected, (state, action) => {
            state.error = action.error.message
        }),
            builder.addCase(getStoreRating.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getStoreRating.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.storeRatings = action.payload
            })
        builder.addCase(getStoreRating.rejected, (state, action) => {
            state.error = action.error.message
        })
        builder.addCase(activateStore.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(activateStore.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false

            })
        builder.addCase(activateStore.rejected, (state, action) => {
            state.error = action.error.message
        })
        builder.addCase(deactivateStore.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(deactivateStore.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false

            })
        builder.addCase(deactivateStore.rejected, (state, action) => {
            state.error = action.error.message
        })
        builder.addCase(storeWallet.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(storeWallet.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.wallet = action.payload

            })
        builder.addCase(storeWallet.rejected, (state, action) => {
            state.error = action.error.message
        })
        builder.addCase(deleteStoreById.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(deleteStoreById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false

            })
        builder.addCase(deleteStoreById.rejected, (state, action) => {
            state.error = action.error.message
        })
        builder.addCase(deleteAccount.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(deleteAccount.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false

            })
        builder.addCase(deleteAccount.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const myStore = (state: RootState) => state.store.myStore;

export const allStores = (state: RootState) => state.store.allStores;

export const storeRatings = (state: RootState) => state.store.storeRatings;

export const storebyId = (state: RootState) => state.store.storeById;

export const storeWalletData = (state: RootState) => state.store.wallet;

export default StoreSlice.reducer;