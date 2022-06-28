/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import {UserState} from "../../utils/types";
import {getRequest, sendPost} from "../../utils/server"
import {Notify} from "../../utils/functions";

const initialState: UserState = {
    userProfile: [],
    notifications: [],
    loading: true,
    error: null
}

export const getUserDetails = createAsyncThunk(
    'user/getDetails',
    async () => {
        const response = await getRequest("/auth/identity")
        return response?.data?.data
    }
)

export const getUserNotifications = createAsyncThunk(
    'user/notifications',
    async () => {
        const response = await getRequest("/sidehustle/notification'")
        return response?.data?.data
    }
)

export const updateUserDetails = createAsyncThunk(
    'user/updateDetails',
    async (payload: {fName: string, lName: string}) => {
        const response = await sendPost("/auth/identity/update", payload)
    }
)

export const updateUserPassword = createAsyncThunk(
    'user/updatePassword',
    async (payload: {email: string}) => {
        const response = await sendPost("/auth/request_reset", payload)
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



        builder.addCase(getUserNotifications.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getUserNotifications.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.notifications = action.payload
        })
        builder.addCase(getUserNotifications.rejected, (state, action) => {
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
export const loading = (state: RootState) => state.user.loading;
export const error = (state: RootState) => state.user.error;

export default UserSlice.reducer;