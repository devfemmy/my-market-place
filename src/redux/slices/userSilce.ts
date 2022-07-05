/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import {UserState} from "../../utils/types";
import {getProfileRequest, getRequest, sendPost, sendProfilePost} from "../../utils/server"
import {Notify} from "../../utils/functions";

const initialState: UserState = {
    userProfile: [],
    notifications: [],
    notificationStat: [],
    loading: true,
    error: null
}

export const getUserDetails = createAsyncThunk(
    'user/getDetails',
    async () => {
        const response = await getProfileRequest("/auth/identity", 'Staging')
        return response?.data?.data
    }
)

export const getSellerNotifications = createAsyncThunk(
    'user/notifications',
    async (payload: {type: string}) => {
        const response = await getRequest("/sidehustle/notification")
        const result = response?.data?.data
        const filteredResponse = result.filter((val) => {
            if(val?.type == payload){
                return val
            }
        })
        return filteredResponse
    }
)

export const getSellerNotificationsStat = createAsyncThunk(
    'user/notificationStat',
    async () => {
        const response = await getRequest("/sidehustle/notification/stat")
        return response?.data?.data
    }
)

export const updateUserDetails = createAsyncThunk(
    'user/updateDetails',
    async (payload: {fName: string, lName: string}) => {
        const response = await sendProfilePost("/auth/identity/update", payload)
        if (response?.status === 200) {
            Notify("Profile Updated Successfully", 'Profile Updated', 'success')
        }else{
            Notify("Password Reset", 'Error resetting password', 'error')
        }
    }
)

export const updateUserPassword = createAsyncThunk(
    'user/updatePassword',
    async (payload: {email: string}) => {
        const response = await sendProfilePost("/auth/request_reset", payload)
        if (response?.status === 200) {
            Notify("Password Reset", 'Check your email', 'success')
        }else{
            Notify("Password Reset", 'Error resetting password', 'error')
        }
    }
)


export const UserSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserDetails.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.userProfile = action.payload
        })
        builder.addCase(getUserDetails.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(getSellerNotifications.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getSellerNotifications.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.notifications = action.payload
        })
        builder.addCase(getSellerNotifications.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(getSellerNotificationsStat.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getSellerNotificationsStat.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.notificationStat = action.payload
        })
        builder.addCase(getSellerNotificationsStat.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(updateUserDetails.pending, (state) => {
            state.loading = true
        })
        builder.addCase(updateUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
        })
        builder.addCase(updateUserDetails.rejected, (state, action) => {
            state.error = action.error.message
        })

        builder.addCase(updateUserPassword.pending, (state) => {
            state.loading = true
        })
        builder.addCase(updateUserPassword.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
        })
        builder.addCase(updateUserPassword.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const userProfile = (state: RootState) => state.user.userProfile;
export const notifications = (state: RootState) => state.user.notifications;
export const notificationStat = (state: RootState) => state.user.notificationStat;
export const loading = (state: RootState) => state.user.loading;
export const error = (state: RootState) => state.user.error;

export default UserSlice.reducer;