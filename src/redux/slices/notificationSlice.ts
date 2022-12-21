import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { NotificationState } from "../../utils/types";
import { getRequest, postRequest } from "../../utils/server"




const initialState: NotificationState = {
    notifications: [],
    sellerStat: null,
    loading: false,
    error: null
}


export const getNotifications = createAsyncThunk(
    'notification/getNotification',
    async () => {
        const response = await getRequest(`/notification/`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getSellerNotificationStat = createAsyncThunk(
    'notification/getStat',
    async () => {
        const response = await getRequest(`/notification/`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const markAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (payload: {notification_id: string}) => {

        const response = await postRequest(`/notification/update?notification_id=${payload?.notification_id}`, payload?.notification_id)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)






export const NotificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getNotifications.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(getNotifications.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.notifications = action.payload
            })
        builder.addCase(getNotifications.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        }),
            builder.addCase(getSellerNotificationStat.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getSellerNotificationStat.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.sellerStat = action.payload
            })
        builder.addCase(getSellerNotificationStat.rejected, (state, action) => {
            state.loading = false,
                state.error = action.error.message
        })
    }
})

export const notification = (state: RootState) => state.notification.notifications;

export const sellerNotificationStat = (state: RootState) => state.notification.sellerStat;



export default NotificationSlice.reducer;