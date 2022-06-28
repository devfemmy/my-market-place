import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { StoreState, StoreCreateFormData, PayoutFormData, StoreUpdateFormData } from "../../utils/types";
import { sendPost, getRequest, uploadImageFunc } from "../../utils/server"




const initialState: StoreState = {
    myStore: [],
    storeById: null,
    allStores: [],
    allCategories: [],
    payouts: [],
    permission: [{value: 'View Store Details', bool: false}, {value: 'View Store Analysis', bool: false}, {value: 'Manage Store Locations', bool: false}, {value: 'Manage shipping fee', bool: false}],
    storeImage: '',
    loading: false,
    error: null
}



export const createStore = createAsyncThunk(
    'store/createStore',
    async (payload: StoreCreateFormData) => {
        const response = await sendPost("/sidehustle/account/create", payload)
    }
)


export const uploadImage = createAsyncThunk(
    'store/upload',
    async (payload: any) => {
        const response = await uploadImageFunc(payload)
        console.log("image upload======", response)
        if (response?.status === 200) {
            return response?.data?.data?.url
        }
    }
)


export const updateStore = createAsyncThunk(
    'store/updateStore',
    async (payload: StoreUpdateFormData) => {
        const payloadData = {
            brandName: payload.brandName,
            description: payload.description,
            imgUrl: payload.imgUrl,
            address: payload.address,
            phoneNumber: payload.phoneNumber,
            location: payload.location,
            status: payload.status
        }

        const response = await  sendPost(`/sidehustle/account/${payload.id}/update`, payloadData)
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


export const addStoreImage = createAsyncThunk(
    'store/images',
    async (payload: {uri: string}) => {
        return payload
    }
)

export const resetStoreImage = createAsyncThunk(
    'store/resetimages',
    async () => {
        return ""
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

export const getPayouts = createAsyncThunk(
    'store/myPayouts',
    async () => {
        const response = await getRequest("/sidehustle/account/payouts")
        if (response?.status === 200) {
            return response?.data?.data?.payouts
        }
    }
)

export const addPayout = createAsyncThunk(
    'store/addPayouts',
    async (payload: PayoutFormData) => {
        const response = await sendPost("/sidehustle/account/payouts", payload, 'v2')
        console.log(response)
    }
)

export const updatePayout = createAsyncThunk(
    'store/updatePayouts',
    async (payload: PayoutFormData) => {
        const id = payload._id
        delete payload._id
        const response = await sendPost('/sidehustle/account/payouts/'+id+'/update', payload)
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

export const getStoreById = createAsyncThunk(
    'store/getStoreById',
    async (payload: string) => {
        const response = await getRequest(`/sidehustle/${payload}/details`)
        if (response?.status === 200) {
            return response?.data?.data
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
            state.loading = false
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


        builder.addCase(getPayouts.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(getPayouts.fulfilled, (state, action) => {
            state.loading = false
            state.payouts = action.payload
        }),
        builder.addCase(getPayouts.rejected, (state, action) => {
            state.error = action.error.message
        }),

        builder.addCase(addPayout.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(addPayout.fulfilled, (state, action) => {
            state.loading = false
        }),
        builder.addCase(addPayout.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        }),


        builder.addCase(updatePayout.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(updatePayout.fulfilled, (state, action) => {
            state.loading = false
        }),
        builder.addCase(updatePayout.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        }),



        builder.addCase(addStoreImage.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(addStoreImage.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.storeImage = action.payload.uri
        })
        builder.addCase(addStoreImage.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(resetStoreImage.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(resetStoreImage.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.storeImage = action.payload
        })
        builder.addCase(resetStoreImage.rejected, (state, action) => {
            state.error = action.error.message
        })

        

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

        builder.addCase(uploadImage.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(uploadImage.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            })
        builder.addCase(uploadImage.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})


export const storeImage = (state: RootState) => state.store.storeImage;

export const myStore = (state: RootState) => state.store.myStore;

export const allStores = (state: RootState) => state.store.allStores;

export const permission = (state: RootState) => state.store.permission;

export const loading = (state: RootState) => state.store.loading;

export const payouts = (state: RootState) => state.store.payouts;

export const allCategories = (state: RootState) => state.store.allCategories;

export const storebyId = (state: RootState) => state.store.storeById;

export default StoreSlice.reducer;