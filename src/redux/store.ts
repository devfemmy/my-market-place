import { configureStore } from '@reduxjs/toolkit'
import StoreReducer from "./slices/StoreSlice"
import ProductReducer from "./slices/productSlice"
import OrderReducer from "./slices/orderSlice"
import UserReducer from './slices/userSilce'
import sideHustleSlice from './slices/sideHustleSlice'
import cartSlice from './slices/cartSlice'
import notificationSlice from './slices/notificationSlice'
import AddressReducer from './slices/AddressSlice'
import AuthReducer from './slices/AuthSlice'
import CategoryReducer from './slices/CategorySlice'
import PayoutReducer from './slices/PayoutSlice'
import ProfileReducer from './slices/ProfileSlice'
import ReviewReducer from './slices/ReviewSlice'
import StaffReducer from './slices/StaffSlice'
import WishlistReducer from './slices/Wishlist'
import DashboardReducer from './slices/DashboardSlice'


export const store = configureStore({
  reducer: {
    store: StoreReducer,
    product: ProductReducer,
    address: AddressReducer,
    order: OrderReducer,
    user: UserReducer,
    sidehustle: sideHustleSlice,
    cart: cartSlice,
    auth: AuthReducer,
    notification: notificationSlice,
    category: CategoryReducer,
    payouts: PayoutReducer,
    profiles: ProfileReducer,
    review: ReviewReducer,
    staff: StaffReducer,
    dashboard: DashboardReducer,
    wishlist: WishlistReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch