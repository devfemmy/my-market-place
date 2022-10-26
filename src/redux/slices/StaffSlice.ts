import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { StaffState } from "../../utils/types";
import { getRequest, postRequest } from "../../utils/server"




const initialState: StaffState = {
    staffs: null,
    loading: false,
    storeRoles: null,
    error: null
}



export const getStaff = createAsyncThunk(
    'staff/getStaff',
    async (payload: string) => {
        const response = await getRequest(`/storeRole/?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getRoles = createAsyncThunk(
    'staff/getRoles',
    async () => {
        const response = await getRequest(`/role`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getAssignedStoresRole = createAsyncThunk(
    'staff/getAssignedStoresRole',
    async () => {
        const response = await getRequest(`/sidehustle/getAssignedStores`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const addStaff = createAsyncThunk(
    'staff/addStaff',
    async (payload: { email: string, role_id: string, store_id: string }, { rejectWithValue }) => {
      
        try {  
            const response = await postRequest(`/storeRole/create`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)





export const StaffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStaff.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getStaff.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.staffs = action.payload
            })
        builder.addCase(getStaff.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        }),
            builder.addCase(getAssignedStoresRole.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getAssignedStoresRole.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.storeRoles = action.payload
            })
        builder.addCase(getAssignedStoresRole.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        })
        builder.addCase(getRoles.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getRoles.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.storeRoles = action.payload
            })
        builder.addCase(getRoles.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        }),
            builder.addCase(addStaff.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(addStaff.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false

            })
        builder.addCase(addStaff.rejected, (state, action) => {
            state.loading = false,
                state.error = action
        })

    }
})

export const staffsData = (state: RootState) => state.staff.staffs;
export const storeRolesList = (state: RootState) => state.staff.storeRoles;


export default StaffSlice.reducer;