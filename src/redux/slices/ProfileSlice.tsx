import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { PayoutBody, PayoutState, ProfileState } from "../../utils/types";
import { bankVerification, getRequest, postAuthRequest, postRequest, specialGetRequest, specialPostRequest } from "../../utils/server"
import AsyncStorage from "@react-native-async-storage/async-storage";






const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null
}



export const getProfile = createAsyncThunk(
    'profile/getProfile',
    async () => {
        // const response = await specialGetRequest(`/auth/identity`)
        // if (response?.status === 200) {
        //     return response?.data?.data[0]
        // }
        var profile = await AsyncStorage.getItem('userInfo').then((req: any) => JSON.parse(req))

        return profile
    }
)

export const changePassword = createAsyncThunk(
    'profile/changePassword',
    async (payload: any) => {
        const response = await postAuthRequest('/auth/request_reset', payload)
        if (response?.status === 200) {
            return response?.data?.data[0]
        }
    }
)

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (payload: { last_name?: string, first_name?: string, email?: string, mobile?: string, img_url?: string, sex?: string, dob?: string }, { rejectWithValue }) => {
        try {
            const response = await postAuthRequest(`/auth/updateProfile`, payload)

            if (response?.status === 200) {
                await AsyncStorage.setItem('userInfo', JSON.stringify(response?.data?.data))
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)



export const ProfileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProfile.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getProfile.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.profile = action.payload
            })
        builder.addCase(getProfile.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        }),
            builder.addCase(updateProfile.pending, (state, action) => {

            }),
            builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.profile = action.payload
            })
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        })

    }
})

export const profileInfo = (state: RootState) => state.profiles.profile;

export const profileLoader = (state: RootState) => state.profiles.loading;



export default ProfileSlice.reducer;