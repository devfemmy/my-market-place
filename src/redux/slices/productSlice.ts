import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { ProductState } from "../../utils/types";
import { sendPost, getRequest } from "../../utils/server"

const initialState: ProductState = {
    myProducts: [],
    newSizes: [],
    newColours: [],
    images: ["", "", "", "", "", ""],
    categories: [],
    loading: false,
    error: null
}

export const getAllProducts = createAsyncThunk(
    'product/allProduct',
    async (payload: string) => {
        const response = await getRequest("/sidehustle/" + payload + "/products")
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const addImage = createAsyncThunk(
    'product/images',
    async (payload: {index: number, uri: string}) => {
        return payload
    }
)

export const addSize = createAsyncThunk(
    'product/sizesadd',
    async (payload: {size: string, price: number, quantity: number}) => {
        return payload
    }
)

export const addColour = createAsyncThunk(
    'product/coloursadd',
    async (payload: {colour: string, price: number, quantity: number, images: Array<any>}) => {
        return payload
    }
)

export const editSize = createAsyncThunk(
    'product/sizesedit',
    async (payload: {index: number, item: {size: string, price: number, quantity: number}}) => {
        return payload
    }
)

export const deleteSize = createAsyncThunk(
    'product/sizesdelete',
    async (payload: number) => {
        return payload
    }
)

export const deleteColour = createAsyncThunk(
    'product/coloursdelete',
    async (payload: number) => {
        return payload
    }
)


export const resetImage = createAsyncThunk(
    'product/resetimages',
    async () => {
        return ["", "", "", "", "", ""]
    }
)



export const ProductSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // IMAGES
        builder.addCase(addImage.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(addImage.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.images[action.payload.index] = action.payload.uri
        })
        builder.addCase(addImage.rejected, (state, action) => {
            state.error = action.error.message
        })
        // SIZES
        builder.addCase(addSize.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(addSize.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.newSizes = state.newSizes.concat([action.payload])
        })
        builder.addCase(addSize.rejected, (state, action) => {
            state.error = action.error.message
        })

        builder.addCase(editSize.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(editSize.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.newSizes[action.payload.index] = action.payload.item
        })
        builder.addCase(editSize.rejected, (state, action) => {
            state.error = action.error.message
        })

        builder.addCase(deleteSize.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(deleteSize.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.newSizes.splice(action.payload, 1)
        })
        builder.addCase(deleteSize.rejected, (state, action) => {
            state.error = action.error.message
        })

        builder.addCase(resetImage.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(resetImage.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.images = action.payload
        })
        builder.addCase(resetImage.rejected, (state, action) => {
            state.error = action.error.message
        })


        // COLOURS
        builder.addCase(addColour.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(addColour.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.newColours = state.newColours.concat([action.payload])
        })
        builder.addCase(addColour.rejected, (state, action) => {
            state.error = action.error.message
        })

        builder.addCase(deleteColour.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(deleteColour.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.newColours.splice(action.payload, 1)
        })
        builder.addCase(deleteColour.rejected, (state, action) => {
            state.error = action.error.message
        })


        // GET ALL PRODUCTS
        builder.addCase(getAllProducts.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(getAllProducts.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.myProducts = action.payload
        })
        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const images = (state: RootState) => state.product.images;
export const myProducts = (state: RootState) => state.product.myProducts;
export const newSizes = (state: RootState) => state.product.newSizes;
export const newColours = (state: RootState) => state.product.newColours;

export default ProductSlice.reducer;