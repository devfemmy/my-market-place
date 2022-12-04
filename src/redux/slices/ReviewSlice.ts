import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { ReviewState } from "../../utils/types";
import { getRequest, postRequest } from "../../utils/server"




const initialState: ReviewState = {
    reviews: null,
    loading: false,
    error: null
}



// export const getStaff = createAsyncThunk(
//     'staff/getStaff',
//     async (payload: string) => {
//         const response = await getRequest(`/storeRole/?store_id=${payload}`)
//         if (response?.status === 200) {
//             return response?.data?.data
//         }
//     }
// )

// export const getRoles = createAsyncThunk(
//     'staff/getRoles',
//     async () => {
//         const response = await getRequest(`/role`)
//         if (response?.status === 200) {
//             return response?.data?.data
//         }
//     }
// )

// export const getAssignedStoresRole = createAsyncThunk(
//     'staff/getAssignedStoresRole',
//     async () => {
//         const response = await getRequest(`/sidehustle/getAssignedStores`)
//         if (response?.status === 200) {
//             return response?.data?.data
//         }
//     }
// )

export const addReview = createAsyncThunk(
    'review/addReview',
    async (payload: { rating: number, product_id: string, comment: string }, { rejectWithValue }) => {

        try {
            const response = await postRequest(`/rating/create`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const reviewComment = createAsyncThunk(
    'review/reviewComment',
    async (payload: { comment_id: string, reply: string }, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/rating/comment/reply`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const fetchReviews = createAsyncThunk(
    'review/fetchReviews',
    async (payload: string) => {
        const response = await getRequest(`/rating/?product_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)




export const ReviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addReview.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(addReview.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false

            })
        builder.addCase(addReview.rejected, (state, action) => {
            state.loading = false,
                state.error = action
        })
        builder.addCase(fetchReviews.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(fetchReviews.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false

            })
        builder.addCase(fetchReviews.rejected, (state, action) => {
            state.loading = false,
                state.error = action
        })
        builder.addCase(reviewComment.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(reviewComment.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false

            })
        builder.addCase(reviewComment.rejected, (state, action) => {
            state.loading = false,
                state.error = action
        })

    }
})



export default ReviewSlice.reducer;