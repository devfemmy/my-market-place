import { configureStore } from '@reduxjs/toolkit'
import StoreReducer from "./slices/StoreSlice"

export const store = configureStore({
  reducer: {
    store: StoreReducer
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch