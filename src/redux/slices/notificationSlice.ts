/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { NotificationFormData } from "../../utils/types";
import {getRequest, sendPost} from "../../utils/server"
import {Notify} from "../../utils/functions";

const initialState: NotificationFormData = {
    notifications: [],
    loading: true,
    error: null
}

export const getNotifications = createAsyncThunk(
    'notifications/getNotifications',
    async () => {
        const response = await getRequest("/sidehustle/notification")
        if (response?.status === 200) {
            const total = response?.data?.data
            return total
        }
    }
)


export const NotificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getNotifications.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getNotifications.fulfilled, (state, action: PayloadAction<any>) => {
            state.notifications = action.payload
            state.loading = false
        })
        builder.addCase(getNotifications.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const notifications = (state: RootState) => state.notification.notifications;
export const loading = (state: RootState) => state.cart.loading;
export const error = (state: RootState) => state.cart.error;

export default NotificationSlice.reducer;