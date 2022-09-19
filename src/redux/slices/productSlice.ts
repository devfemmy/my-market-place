/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { ProductState, ProductCreateFormData, ProductVariant } from "../../utils/types";
import {getRequest, sendPost, sendDelete} from "../../utils/server"
import { boolean } from "yup";

const initialState: ProductState = {
    myProducts: [],
    productVariants: [],
    productSpec: [],
    selectedProducts: [],
    productBackground: [],
    searching: false,
    productBySlug: null,
    editableSlug: null,
    newSizes: [],
    newColours: [],
    newSizeColours: [],
    images: [""],
    categories: [],
    loading: false,
    error: null
}

export const getCategories = createAsyncThunk(
    'product/allCategories',
    async () => {
        const response = await getRequest("/category")
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getAllProducts = createAsyncThunk(
    'product/allProducts',
    async (payload: string) => {
        const response = await getRequest(`/product/seller?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const searchProducts = createAsyncThunk(
    'product/searchingProduct',
    (payload: string) => {
        return payload
    }
)

export const searchProduct = createAsyncThunk(
    'product/searchProduct',
    async (payload: { search: string, id: string }) => {
        const response = await getRequest(`/sidehustle/seller/product/search?searchString=${payload.search}&sidehustleId=${payload.id}`)
        if(payload.search == ''){
            return ''
        }
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getProductBySlug = createAsyncThunk(
    'product/allProduct',
    async (payload: string) => {
        const response = await getRequest(`/product/seller?slug=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getProductBySlugBuyer = createAsyncThunk(
    'product/getProductBySlugBuyer',
    async (payload: string) => {
        const response = await getRequest(`/product?slug=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getPayoutBackground = createAsyncThunk(
    'product/allProductBack',
    async () => {
        const response = await getRequest(`/sidehustle/account/payouts`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (payload: ProductCreateFormData, {rejectWithValue}) => {
        const payloadData = {
            name: payload?.name,
            description: payload?.description,
            category_id: payload?.categories,
            store_id: payload.id,
        }

        try {
            const response = await sendPost(`/product/create`, payloadData)
            return response?.data?.data
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
        
    }
)

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async (payload: ProductCreateFormData, {rejectWithValue}) => {
        try {
            const id = payload?.id
            delete payload?.id
            const response = await sendPost(`/product/update/?product_id=${id}`, payload)
        } catch (e: any) {
            console.log(e?.response?.data)
            return rejectWithValue(e?.response?.data?.message)
        }
        
    }
)


export const activateProduct = createAsyncThunk(
    'product/activateProduct',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await sendPost(`/product/activate/?product_id=${payload}`, payload)
            console.log(Object.keys(response.data))
            return response.data
        }
        catch (e: any) {
            console.log(e?.response?.data)
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)


export const deactivateProduct = createAsyncThunk(
    'product/deactivateProduct',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await sendPost(`/product/deactivate/?product_id=${payload}`, payload)
            console.log(Object.keys(response.data))
            return response.data
        }
        catch (e: any) {
            console.log(e?.response?.data)
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)



export const createProductVariant = createAsyncThunk(
    'product/createProductVariant',
    async (payload: ProductVariant, {rejectWithValue}) => {

        try {
            const response = await sendPost(`/product/variant/create`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        } catch (e: any) {
            console.log(e?.response?.data)
            return rejectWithValue(e?.response?.data?.message)
        }
        
    }
)

export const updateProductVariant = createAsyncThunk(
    'product/updateProductVariant',
    async (payload: any, {rejectWithValue}) => {

        try {
            const id = payload?.product_variant_id
            delete payload?.product_variant_id
            const response = await sendPost(`/product/variant/update?product_variant_id=${id}`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        } catch (e: any) {
            console.log(e?.response?.data?.message)
            return rejectWithValue(e?.response?.data?.message)
        }
        
    }
)

export const deleteProductVariant = createAsyncThunk(
    'product/deleteProductVariant',
    async (payload: string, {rejectWithValue}) => {

        try {
            const response = await sendDelete(`/product/variant/delete?product_variant_id=${payload}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        } catch (e: any) {
            console.log(e?.response?.data?.message)
            return rejectWithValue(e?.response?.data?.message)
        }
        
    }
)

export const activateProductVariant = createAsyncThunk(
    'product/activateProductVariant',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await sendPost(`/product/variant/activate/?product_variant_id=${payload}`, payload)
        }
        catch (e: any) {
            console.log(e?.response?.data)
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)


export const deactivateProductVariant = createAsyncThunk(
    'product/deactivateProductVariant',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await sendPost(`/product/variant/deactivate/?product_variant_id=${payload}`, payload)
        }
        catch (e: any) {
            console.log(e?.response?.data)
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)


export const createProductVariantSpec = createAsyncThunk(
    'product/createProductVariantSpec',
    async (payload: any, {rejectWithValue}) => {

        try {
            const response = await sendPost(`/product/variant/spec/create`, payload)
            if (response?.status === 200) {
                return response?.data?.data
            }
        } catch (e: any) {
            console.log(e?.response?.data)
            return rejectWithValue(e?.response?.data?.message)
        }
        
    }
)


export const deleteProductVariantSpec = createAsyncThunk(
    'product/deleteProductVariantSpec',
    async (payload: string, {rejectWithValue}) => {

        try {
            const response = await sendDelete(`/product/variant/spec/delete?product_variant_spec_id=${payload}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        } catch (e: any) {
            console.log(e?.response?.data?.message)
            return rejectWithValue(e?.response?.data?.message)
        }
        
    }
)

export const getProductVariants = createAsyncThunk(
    'product/getProductVariants',
    async (payload: string) => {
        const response = await getRequest(`/product/variant/?product_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getProductVariantSpec = createAsyncThunk(
    'product/getProductVariantSpec',
    async (payload: string) => {
        const response = await getRequest(`/product/variant/spec?product_variant_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const addImage = createAsyncThunk(
    'product/images',
    (payload: {index: number, uri: string}) => {
        return payload
    }
)

export const UpdateEditableSlug = createAsyncThunk(
    'product/updateEditableSlug',
    (payload: any) => {
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

export const addSizeColour = createAsyncThunk(
    'product/sizecoloursadd',
    (payload: {colour: string, size: Array<any>, images: Array<string>}) => {
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

export const deleteSizeColour = createAsyncThunk(
    'product/sizecoloursdelete',
    (payload: number) => {
        return payload
    }
)


export const resetImage = createAsyncThunk(
    'product/resetimages',
    () => {
        return [""]
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
            if(state.images.length - 1 == action.payload.index){
                const newArr = [...state.images, ""]
                state.images = newArr
            }
            state.images[action.payload.index] = action.payload.uri
        })
        builder.addCase(addImage.rejected, (state, action) => {
            state.error = action.error.message
        })


        // EDITABLE SLUG
        builder.addCase(UpdateEditableSlug.pending, (state) => {
            state.loading = true
        })
        builder.addCase(UpdateEditableSlug.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.editableSlug = action.payload
        })
        builder.addCase(UpdateEditableSlug.rejected, (state, action) => {
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


        // SIZE COLOURS

        builder.addCase(addSizeColour.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addSizeColour.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.newSizeColours = state.newSizeColours.concat([action.payload])
            state.newSizes = []
        })
        builder.addCase(addSizeColour.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(deleteSizeColour.pending, (state) => {
            state.loading = true
        })
        builder.addCase(deleteSizeColour.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.newSizeColours.splice(action.payload, 1)
        })
        builder.addCase(deleteSizeColour.rejected, (state, action) => {
            state.error = action.error.message
        })


        // GET CATEGORIES
        builder.addCase(getCategories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getCategories.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.categories = action.payload
        })
        builder.addCase(getCategories.rejected, (state, action) => {
            state.error = action.error.message
        })


        // GET PRODUCTS
        builder.addCase(getAllProducts.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllProducts.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.myProducts = action.payload
            state.selectedProducts = action.payload
        })
        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(getPayoutBackground.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getPayoutBackground.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.productBackground = action.payload
        })
        builder.addCase(getPayoutBackground.rejected, (state, action) => {
            state.error = action.error.message
        })



        builder.addCase(searchProducts.pending, (state) => {
            state.searching = true
        })
        builder.addCase(searchProducts.fulfilled, (state, action: PayloadAction<any>) => {
            state.selectedProducts = state.myProducts.filter(function(val: any){
                if(val?.name.toLowerCase().startsWith(action.payload.toLowerCase())){
                    return val
                }
            })
            state.searching = false
        })
        builder.addCase(searchProducts.rejected, (state, action) => {
            state.error = action.error.message
        })


        builder.addCase(searchProduct.pending, (state, action) => {
            state.searching = true
        }),
        builder.addCase(searchProduct.fulfilled, (state, action: PayloadAction<any>) => {
            if(action.payload == ''){
                state.selectedProducts = state.myProducts
                state.searching = false
            }else{
                state.selectedProducts = action.payload
                state.searching = false
            }
            
            
        })
        builder.addCase(searchProduct.rejected, (state, action) => {
            state.selectedProducts = []
            state.error = action.error.message
        }),


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
            state.productBySlug = action.payload
            state.newSizes = []
            state.newColours = []
            state.newSizeColours = []
            state.productVariants = []
        })
        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })


        //CREATE PRODUCT VARIANT

        builder.addCase(createProductVariant.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(createProductVariant.fulfilled, (state, action) => {
            state.loading = false
            // state.productVariants = state.productVariants.concat([action.payload])
        })
        builder.addCase(createProductVariant.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })


        //UPDATE PRODUCT VARIANT

        builder.addCase(updateProductVariant.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(updateProductVariant.fulfilled, (state, action) => {
            state.loading = false
            const updatedArr = state.productVariants?.filter((item) => {
                if(item?.id == action.payload?.product_variant_id){
                    var arr = item
                    arr.size = action.payload.size
                    arr.quantity = action.payload.quantity
                    arr.amount = action.payload.amount
                    return arr
                }else{
                    return item
                }
            })
            state.productVariants = updatedArr
        })
        builder.addCase(updateProductVariant.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })
        

        //DELETE PRODUCT VARIANT

        builder.addCase(deleteProductVariant.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(deleteProductVariant.fulfilled, (state, action) => {
            state.loading = false
            // state.productVariants = state.productVariants.concat([action.payload])
        })
        builder.addCase(deleteProductVariant.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })

        // ACTIVATE PRODUCT
        builder.addCase(activateProduct.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(activateProduct.fulfilled, (state, action) => {
            state.loading = false
        }),
        builder.addCase(activateProduct.rejected, (state, action) => {
            state.loading = false,
                state.error = action.payload
        }),

        // DEACTIVATE PRODUCT
        builder.addCase(deactivateProduct.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(deactivateProduct.fulfilled, (state, action) => {
            state.loading = false
        }),
        builder.addCase(deactivateProduct.rejected, (state, action) => {
            state.loading = false,
                state.error = action.payload
        }),


        // ACTIVATE PRODUCT VARIANT
        builder.addCase(activateProductVariant.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(activateProductVariant.fulfilled, (state, action) => {
            state.loading = false
        }),
        builder.addCase(activateProductVariant.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        }),
        

        // DEACTIVATE PRODUCT VARIANT
        builder.addCase(deactivateProductVariant.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(deactivateProductVariant.fulfilled, (state, action) => {
            state.loading = false
        }),
        builder.addCase(deactivateProductVariant.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        }),

        //CREATE PRODUCT VARIANT SPEC

        builder.addCase(createProductVariantSpec.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(createProductVariantSpec.fulfilled, (state, action) => {
            state.loading = false
            // const updatedArr = state.productVariants?.filter((item) => {
            //     if(item?.id == action.payload?.id){
            //         return action.payload
            //     }else{
            //         return item
            //     }
            // })
            // state.productVariants = updatedArr
        })
        builder.addCase(createProductVariantSpec.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })


        //DELETE PRODUCT VARIANT SPEC

        builder.addCase(deleteProductVariantSpec.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(deleteProductVariantSpec.fulfilled, (state, action) => {
            state.loading = false
        })
        builder.addCase(deleteProductVariantSpec.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })


        builder.addCase(getProductVariants.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(getProductVariants.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false,
            state.productVariants = action.payload
        })
        builder.addCase(getProductVariants.rejected, (state, action) => {
            state.loading = false,
            state.error = action.error.message
        })
        builder.addCase(getProductVariantSpec.pending, (state, action) => {

        }),
        builder.addCase(getProductVariantSpec.fulfilled, (state, action: PayloadAction<any>) => {
            state.productSpec = action.payload
        })
        builder.addCase(getProductVariantSpec.rejected, (state, action) => {

        })



        builder.addCase(updateProduct.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false
            state.newSizes = []
            state.newColours = []
            state.newSizeColours = []
            state.images = [""]
            state.productVariants = []
        })
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading = false,
            state.error = action.payload
        })
    }
})

export const images = (state: RootState) => state.product.images;
export const editableSlug = (state: RootState) => state.product.editableSlug;
export const myProducts = (state: RootState) => state.product.myProducts;
export const productVariants = (state: RootState) => state.product.productVariants;
export const categories = (state: RootState) => state.product.categories;
export const productBackground = (state: RootState) => state.product.productBackground;
export const selectedProducts = (state: RootState) => state.product.selectedProducts;
export const loading = (state: RootState) => state.product.loading;
export const searching = (state: RootState) => state.product.searching;
export const productBySlug = (state: RootState) => state.product.productBySlug;
export const newSizes = (state: RootState) => state.product.newSizes;
export const newColours = (state: RootState) => state.product.newColours;
export const newSizeColours = (state: RootState) => state.product.newSizeColours;

export default ProductSlice.reducer;