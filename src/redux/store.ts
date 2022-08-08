import { configureStore } from '@reduxjs/toolkit'
import StoreReducer from "./slices/StoreSlice"
import ProductReducer from "./slices/productSlice"
import OrderReducer from "./slices/orderSlice"
import UserReducer from './slices/userSilce'
import sideHustleSlice from './slices/sideHustleSlice'

export const store = configureStore({
  reducer: {
    store: StoreReducer,
    product: ProductReducer,
    order: OrderReducer,
    user: UserReducer,
    sidehustle: sideHustleSlice
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch