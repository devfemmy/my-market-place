/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { ProductState, ProductCreateFormData } from "../../utils/types";
import {getRequest, sendPost} from "../../utils/server"

const initialState: ProductState = {
    myProducts: [],
    productBySlug: null,
    newSizes: [],
    newColours: [],
    images: ["", "", "", "", "", ""],
    categories: [],
    loading: false,
    error: null
}

export const getAllProducts = createAsyncThunk(
    'product/allProducts',
    async (payload: string) => {
        const response = await getRequest("/sidehustle/" + payload + "/products")
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getProductBySlug = createAsyncThunk(
    'product/allProduct',
    async (payload: string) => {
        const response = await getRequest(`/sidehustle/product/?slug=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (payload: ProductCreateFormData) => {
        const payloadData = {
            name: payload?.name,
            description: payload?.description,
            categories: payload?.categories,
            variants: payload?.variants,
            isDraft: payload?.isDraft,
            status: payload?.status
        }
        const response = await sendPost(`/sidehustle/${payload.id}/products/add`, payloadData)
        console.log(response?.data)
        return response?.data
    }
)

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async (payload: ProductCreateFormData) => {
        // const response = await sendPost(`/sidehustle/product/${payload.id}/update`, payload, 'v2')
        // console.log(response?.data)
        try {
            const response = await sendPost(`/sidehustle/product/${payload.id}/update`, payload)
            console.log(response?.data)
            return response?.data
        } catch (error) {
            console.log(error)
            console.log(error?.message)
            console.log(error?.status)
            console.log(error?.data)
        }
        
    }
)

export const addImage = createAsyncThunk(
    'product/images',
    (payload: {index: number, uri: string}) => {
        return payload
    }
)

export const addSize = createAsyncThunk(
    'product/sizesadd',
    (payload: {size: string, price: number, quantity: number}) => {
        return payload
    }
)

export const addColour = createAsyncThunk(
    'product/coloursadd',
    (payload: {colour: string, price: number, quantity: number, images: Array<string>}) => {
        return payload
    }
)

export const editSize = createAsyncThunk(
    'product/sizesedit',
    (payload: {index: number, item: {size: string, price: number, quantity: number}}) => {
        return payload
    }
)

export const editColour = createAsyncThunk(
    'product/coloursedit',
    (payload: {index: number, item: {colour: string, price: number, quantity: number, images: Array<string>}}) => {
        return payload
    }
)

export const deleteSize = createAsyncThunk(
    'product/sizesdelete',
    (payload: number) => {
        return payload
    }
)

export const deleteColour = createAsyncThunk(
    'product/coloursdelete',
    (payload: number) => {
        return payload
    }
)


export const resetImage = createAsyncThunk(
    'product/resetimages',
    () => {
        return ["", "", "", "", "", ""]
    }
)



export const ProductSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // IMAGES
        builder.addCase(addImage.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addImage.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.images[action.payload.index] = action.payload.uri
        })
        builder.addCase(addImage.rejected, (state, action) => {
            state.error = action.error.message
        })



        // SIZES
        builder.addCase(addSize.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addSize.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.newSizes = state.newSizes.concat([action.payload])
        })
        builder.addCase(addSize.rejected, (state, action) => {
            state.error = action.error.message
        })

        builder.addCase(editSize.pending, (state) => {
            state.loading = true
        })
        builder.addCase(editSize.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.newSizes[action.payload.index] = action.payload.item
        })
        builder.addCase(editSize.rejected, (state, action) => {
            state.error = action.error.message
        })

        builder.addCase(deleteSize.pending, (state) => {
            state.loading = true
        })
        builder.addCase(deleteSize.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.newSizes.splice(action.payload, 1)
        })
        builder.addCase(deleteSize.rejected, (state, action) => {
            state.error = action.error.message
        })

        

        builder.addCase(resetImage.pending, (state) => {
            state.loading = true
        })
        builder.addCase(resetImage.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.images = action.payload
        })
        builder.addCase(resetImage.rejected, (state, action) => {
            state.error = action.error.message
        })


        // COLOURS
        builder.addCase(addColour.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addColour.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.newColours = state.newColours.concat([action.payload])
        })
        builder.addCase(addColour.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(editColour.pending, (state) => {
            state.loading = true
        })
        builder.addCase(editColour.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.newColours[action.payload.index] = action.payload.item
        })
        builder.addCase(editColour.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(deleteColour.pending, (state) => {
            state.loading = true
        })
        builder.addCase(deleteColour.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.newColours.splice(action.payload, 1)
        })
        builder.addCase(deleteColour.rejected, (state, action) => {
            state.error = action.error.message
        })


        // GET PRODUCTS
        builder.addCase(getAllProducts.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllProducts.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.myProducts = action.payload
        })
        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.error = action.error.message
        })


        builder.addCase(getProductBySlug.pending, (state, action) => {
            state.loading = true,
            state.productBySlug = null
        }),
        builder.addCase(getProductBySlug.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.productBySlug = action.payload
        })
        builder.addCase(getProductBySlug.rejected, (state, action) => {
            state.error = action.error.message,
            state.productBySlug = null
        })


        //CREATE PRODUCTS

        builder.addCase(createProduct.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false
            state.productBySlug = action.payload?.message
        })
        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })

        builder.addCase(updateProduct.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false
        })
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })
    }
})

export const images = (state: RootState) => state.product.images;
export const myProducts = (state: RootState) => state.product.myProducts;
export const loading = (state: RootState) => state.product.loading;
export const productBySlug = (state: RootState) => state.product.productBySlug;
export const newSizes = (state: RootState) => state.product.newSizes;
export const newColours = (state: RootState) => state.product.newColours;


export default ProductSlice.reducer;