import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { OrderState} from "../../utils/types";
import { sendPost, getRequest } from "../../utils/server"
import { string } from "yup";

const initialState: OrderState = {
    allOrders: [],
    selectedOrders: [],
    selected: '',
    availableStatus: [],
    loading: true,
    searching: false,
    error: null
}

export const getAllOrders = createAsyncThunk(
    'order/allOrder',
    async () => {
        const response = await getRequest("/sidehustle/orders/sales?isGrouped=true&withOrderList=true")
        if (response?.status === 200) {
            const orderResponse: Array<any> = []
            const total = response?.data?.data
            const orders = total.map(function(val: any){
                return val.orders
            })
            return [].concat.apply([],orders)
        }
    }
)

export const rejectOrder = createAsyncThunk(
    'order/rejectOrder',
    async (payload: {}) => {
        const response = await getRequest("/sidehustle/orders/sales?isGrouped=true&withOrderList=true")
        if (response?.status === 200) {
            
        }
    }
)

export const markAsComplete = createAsyncThunk(
    'order/markAsComplete',
    async (payload: {}) => {
        const response = await sendPost(payload, 'sidehustle/orders/'+payload.orderId+'/markAsComplete', payload, 'v2')
        if (response?.status === 200) {
            
        }
    }
)

export const markAsProcessing = createAsyncThunk(
    'order/markAsProcessing',
    async (payload: {}) => {
        const response = await sendPost("/sidehustle/orders/sales?isGrouped=true&withOrderList=true", {}, 'v2')
        if (response?.status === 200) {
            
        }
    }
)

export const markAsDispatched = createAsyncThunk(
    'order/markAsDispatched',
    async (payload: {}) => {
        const response = await sendPost("/sidehustle/orders/sales?isGrouped=true&withOrderList=true", {}, 'v2')
        if (response?.status === 200) {
            
        }
    }
)

export const filterOrders = createAsyncThunk(
    'order/selectedOrder',
    async (payload: string) => {
        return payload
    }
)

export const searchOrders = createAsyncThunk(
    'order/searchingOrder',
    async (payload: string) => {
        return payload
    }
)


export const OrderSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(getAllOrders.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(getAllOrders.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.selected = ''
            state.selectedOrders = action.payload,
            state.allOrders = action.payload
            state.availableStatus = action.payload.map(function(val: any){
                return val.orderInfo.status
            }).filter((v: any, i: any, a: string) => a.indexOf(v) === i)
        })
        builder.addCase(getAllOrders.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(filterOrders.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(filterOrders.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            if(action.payload == 'All'){
                state.selectedOrders = state.allOrders
            }else{
                state.selectedOrders = state.allOrders.filter(function(val: any){
                    if(val?.orderInfo?.status.toLowerCase() == action.payload.toLowerCase()){
                        return val
                    }
                })
            }
            state.selected = action.payload
        })
        builder.addCase(filterOrders.rejected, (state, action) => {
            state.error = action.error.message
        })


        builder.addCase(searchOrders.pending, (state, action) => {
            state.searching = true
        }),
        builder.addCase(searchOrders.fulfilled, (state, action: PayloadAction<any>) => {
            state.selectedOrders = state.allOrders.filter(function(val: any){
                if(val?.orderInfo?.name.toLowerCase().startsWith(action.payload.toLowerCase()) || val?.orderInfo?.orderRef.toLowerCase().startsWith(action.payload.toLowerCase())){
                    return val
                }
            })
            state.selected = 'All'
            state.searching = false
        })
        builder.addCase(searchOrders.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const allOrders = (state: RootState) => state.order.allOrders;
export const selectedOrders = (state: RootState) => state.order.selectedOrders;
export const selected = (state: RootState) => state.order.selected;
export const availableStatus = (state: RootState) => state.order.availableStatus;

export const loading = (state: RootState) => state.order.loading;
export const searching = (state: RootState) => state.order.searching;

export default OrderSlice.reducer;