import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { AddressState } from "../../utils/types";
import { deleteRequestNoPayload, getRequest, postAuthRequest, postRequest } from "../../utils/server"




const initialState: AddressState = {
    locations: [],
    loading: false,
    error: null
}


export const getAddress = createAsyncThunk(
    'address/getAddress',
    async () => {
        const response = await getRequest(`/addressBook`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (payload: { state: string, street: string, city: string, first_name: string, last_name: string, email: string, phone_number: string, default: boolean }, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/addressBook/create`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async (payload: { id: string, default: boolean }, { rejectWithValue }) => {
        try {
            const pd = {
                default: payload?.default
            }
            const response = await postRequest(`/addressBook/update?address_book_id=${payload.id}`, pd)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (payload: { id: string }, { rejectWithValue }) => {
        try {
            const response = await deleteRequestNoPayload(`/addressBook/delete?address_item_id=${payload.id}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const deliveryFee = createAsyncThunk(
    'address/deliveryFee',
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/product/delivery_fee`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)




export const AddressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAddress.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getAddress.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.locations = action.payload
            }),
            builder.addCase(getAddress.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            }),
            builder.addCase(addAddress.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(addAddress.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            }),
            builder.addCase(addAddress.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            })
        builder.addCase(updateAddress.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(updateAddress.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            }),
            builder.addCase(updateAddress.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            })
        builder.addCase(deleteAddress.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(deleteAddress.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            }),
            builder.addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            })
        builder.addCase(deliveryFee.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(deliveryFee.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            }),
            builder.addCase(deliveryFee.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            })
    }
})

export const AddressData = (state: RootState) => state.address.locations;

export default AddressSlice.reducer;