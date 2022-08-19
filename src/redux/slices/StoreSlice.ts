import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { StoreState, StoreCreateFormData, PayoutFormData, AssignUserFormData, StoreUpdateFormData } from "../../utils/types";
import { sendPost, getRequest, uploadImageFunc } from "../../utils/server"




const initialState: StoreState = {
    myStore: [],
    storeById: null,
    staffs: null,
    filteredStaffs: [],
    allStores: [],
    allCategories: [],
    payouts: [],
    reviews: [],
    filteredreviews: [],
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
        if(payload == 'Super Admin'){
            return [{value: 'View Store Details', bool: true}, {value: 'View Store Analysis', bool: true}, {value: 'Manage Store Locations', bool: true}, {value: 'Manage shipping fee', bool: true}]
        }
        else if(payload == 'Admin'){
            return [{value: 'View Store Details', bool: true}, {value: 'View Store Analysis', bool: true}, {value: 'Manage Store Locations', bool: true}, {value: 'Manage shipping fee', bool: true}]
        }
        else if(payload == 'Store Vetter'){
            return [{value: 'View Store Details', bool: true}, {value: 'View Store Analysis', bool: true}, {value: 'Manage Store Locations', bool: true}, {value: 'Manage shipping fee', bool: true}]
        }
        else if(payload == 'Store Owner'){
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

export const getStaff = createAsyncThunk(
    'staff/getStaff',
    async (payload: string) => {
        const response = await getRequest(`/sidehustle/getStoreUsers?storeId=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const searchStaffs = createAsyncThunk(
    'product/searchStaff',
    (payload: string) => {
        return payload
    }
)

export const assignUser = createAsyncThunk(
    'store/assignUser',
    async (payload: AssignUserFormData) => {
        const response = await sendPost("/sidehustle/addUserToStore", payload)
        if (response?.status === 200) {
            return response?.data?.data
        }
        
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

export const getStoreReviews = createAsyncThunk(
    'store/getStoreReviews',
    async (payload: string) => {
        const response = await getRequest(`/sidehustle/rate/ratings?sidehustleId=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const filterStoreReviews = createAsyncThunk(
    'store/filterStoreReviews',
    async (payload: {type: string, value: string}) => {
        return payload
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
            state.error = action.error.message
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



        builder.addCase(assignUser.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(assignUser.fulfilled, (state, action) => {
            state.loading = false
        }),
        builder.addCase(assignUser.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        }),


        builder.addCase(getStaff.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(getStaff.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.staffs = action.payload
            state.filteredStaffs = action.payload
        })
        builder.addCase(getStaff.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        }),


        builder.addCase(searchStaffs.pending, (state) => {
            state.loading = false
        })
        builder.addCase(searchStaffs.fulfilled, (state, action: PayloadAction<any>) => {
            state.filteredStaffs = state.staffs.filter(function(val: any){
                const fullName = `${val?.user?.fName} ${val?.user?.lName}`
                if(
                    val?.user?.fName.toLowerCase().startsWith(action.payload.toLowerCase()) ||
                    val?.user?.lName.toLowerCase().startsWith(action.payload.toLowerCase()) ||
                    val?.user?.email.toLowerCase().startsWith(action.payload.toLowerCase()) ||
                    fullName.toLowerCase().startsWith(action.payload.toLowerCase())
                ){
                    return val
                }
            })
            state.loading = false
        })
        builder.addCase(searchStaffs.rejected, (state, action) => {
            state.error = action.error.message
        })


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


        builder.addCase(getStoreReviews.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(getStoreReviews.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.reviews = action.payload
            state.filteredreviews = action.payload
        })
        builder.addCase(getStoreReviews.rejected, (state, action) => {
            state.error = action.error.message
        })


        builder.addCase(filterStoreReviews.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(filterStoreReviews.fulfilled, (state, action: PayloadAction<any>) => {
            if(action.payload.value == 'All'){
                state.filteredreviews = state.reviews
            }
            if(action.payload.type == 'size' && action.payload.value !== 'All'){
                state.filteredreviews = state.reviews.filter(function(val: any){
                    if(val?.rating === Number(action.payload.value)){
                        return val
                    }
                })
            }
            if(action.payload.type == 'time'){
                const WEEK_LENGTH = 604800000
                const MONTH_LENGTH = 2629746000
                
                if(action.payload.value == 'Newest'){
                    state.filteredreviews =  state.reviews.sort(function(a, b){
                        return new Date(a?.createdAt) - new Date(b?.createdAt);
                    })
                }
                if(action.payload.value == 'This week'){
                    state.filteredreviews = state.reviews.filter(function(val: any){
                        if((new Date().getTime() - new Date(val?.createdAt).getTime()) < WEEK_LENGTH){
                            return val
                        }
                    })
                }

                if(action.payload.value == 'This month'){
                    state.filteredreviews = state.reviews.filter(function(val: any){
                        if((new Date().getTime() - new Date(val?.createdAt).getTime()) < MONTH_LENGTH){
                            return val
                        }
                    })
                }
            }

            state.loading = false
        })
        builder.addCase(filterStoreReviews.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})


export const storeImage = (state: RootState) => state.store.storeImage;

export const myStore = (state: RootState) => state.store.myStore;

export const allStores = (state: RootState) => state.store.allStores;

export const permission = (state: RootState) => state.store.permission;

export const loading = (state: RootState) => state.store.loading;

export const error = (state: RootState) => state.store.error;

export const payouts = (state: RootState) => state.store.payouts;

export const reviews = (state: RootState) => state.store.reviews;

export const filteredreviews = (state: RootState) => state.store.filteredreviews;

export const allCategories = (state: RootState) => state.store.allCategories;

export const storebyId = (state: RootState) => state.store.storeById;

export const staffs = (state: RootState) => state.store.staffs;

export const filteredStaffs = (state: RootState) => state.store.filteredStaffs;

export default StoreSlice.reducer;