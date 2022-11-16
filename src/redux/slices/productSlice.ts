import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { ProductCreateFormData, ProductState, ProductUpdateFormData, ProductVariantFormData, ProductVariantSpecFormData, StoreCreateFormData } from "../../utils/types";
import { postRequest, getRequest, uploadImageFunc, deleteRequestNoPayload } from "../../utils/server"




const initialState: ProductState = {
    products: [],
    productVariants: null,
    productSpec: [],
    buyerProducts: [],
    productBySlug: null,
    loading: false,
    error: null
}



export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (payload: ProductCreateFormData, { rejectWithValue }) => {
        const payloadData = {
            name: payload?.name,
            description: payload?.description,
            category_id: payload?.category_id,
            store_id: payload?.store_id
        }


        try {
            const response = await postRequest(`/product/create`, payloadData)

            return response?.data
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)


export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async (payload: ProductUpdateFormData, { rejectWithValue }) => {
        const payloadData = {
            name: payload?.name,
            description: payload?.description,
            category_id: payload?.category_id,
            //store_id: payload?.store_id
        }
        try {
            const response = await postRequest(`/product/update/?product_id=${payload.id}`, payloadData)

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)

export const elasticSearch = createAsyncThunk(
    'product/elasticSearch',
    async (payload: { search: string }, { rejectWithValue }) => {
        try {
            const response = await getRequest(`/product/search?search_string=${payload.search}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const activateProduct = createAsyncThunk(
    'product/activateProduct',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/product/activate/?product_id=${payload}`, payload)

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const deactivateProduct = createAsyncThunk(
    'product/deactivateProduct',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/product/deactivate/?product_id=${payload}`, payload)
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)



export const getProduct = createAsyncThunk(
    'product/getProduct',
    async (payload: string) => {
        const response = await getRequest(`/product/seller?store_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getProductBuyer = createAsyncThunk(
    'product/getProductBuyer',
    async () => {
        const response = await getRequest(`/product`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const getProductBySlug = createAsyncThunk(
    'product/getProductBySlug',
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

export const createProductVariantSpec = createAsyncThunk(
    'product/createProductVariantSpec',
    async (payload: ProductVariantSpecFormData, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/product/variant/spec/create`, payload)
            return response?.data
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)

export const createProductVariant = createAsyncThunk(
    'product/createProductVariant',
    async (payload: ProductVariantFormData, { rejectWithValue }) => {

        try {
            const response = await postRequest(`/product/variant/create`, payload)
            return response?.data
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)

export const activateProductVariant = createAsyncThunk(
    'product/activateProductVariant',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/product/variant/activate/?product_variant_id=${payload}`, payload)

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const deactivateProductVariant = createAsyncThunk(
    'product/deactivateProductVariant',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await postRequest(`/product/variant/deactivate/?product_variant_id=${payload}`, payload)
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const updateProductVariant = createAsyncThunk(
    'product/updateProductVariant',
    async (payload: any, { rejectWithValue }) => {
        const payloadData = {
            color: payload?.color,
            img_urls: payload?.img_urls,
        }
        try {
            const response = await postRequest(`/product/variant/update?product_variant_id=${payload?.id}`, payloadData)

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)


export const deleteProductVariant = createAsyncThunk(
    'product/deleteProductVariant',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await deleteRequestNoPayload(`/product/variant/delete?product_variant_id=${payload}`)

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)

export const updateProductVariantSpec = createAsyncThunk(
    'product/updateProductVariantSpec',
    async (payload: { product_variant_spec_id: string, quantity: number, amount: number, size?: string }, { rejectWithValue }) => {
        const payloadData = {
            quantity: payload?.quantity,
            amount: payload?.amount,
            size: payload?.size
        }

        try {
            const response = await postRequest(`/product/variant/spec/update?product_variant_spec_id=${payload?.product_variant_spec_id}`, payloadData)
            return response?.data?.data
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)

export const deleteProductVariantSpec = createAsyncThunk(
    'product/deleteProductVariantSpec',
    async (payload: string, { rejectWithValue }) => {
        try {
            const response = await deleteRequestNoPayload(`/product/variant/spec/delete?product_variant_spec_id=${payload}`)

        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }

    }
)

export const getProductByCategory = createAsyncThunk(
    'product/getProductByCategory',
    async (payload: string) => {
        const response = await getRequest(`/product?category_id=${payload}`)
        if (response?.status === 200) {
            return response?.data?.data
        }
    }
)

export const searchProduct = createAsyncThunk(
    'product/searchProduct',
    async (payload: { search: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await getRequest(`/sidehustle/seller/product/search?searchString=${payload.search}&sidehustleId=${payload.id}`)
            if (response?.status === 200) {
                return response?.data?.data
            }
        }
        catch (e: any) {
            return rejectWithValue(e?.response?.data?.message)
        }
    }
)


export const ProductSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createProduct.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
            }),
            builder.addCase(createProduct.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
            builder.addCase(updateProduct.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
            }),
            builder.addCase(updateProduct.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
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
            builder.addCase(getProduct.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getProduct.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.products = action.payload
            })
        builder.addCase(getProduct.rejected, (state, action) => {
            state.products = []
            state.error = action.error.message
        }),
            builder.addCase(getProductBuyer.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getProductBuyer.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.buyerProducts = action.payload
            })
        builder.addCase(getProductBuyer.rejected, (state, action) => {
            state.buyerProducts = []
            state.error = action.error.message
        }),
            builder.addCase(searchProduct.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(searchProduct.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.products = action.payload
            })
        builder.addCase(searchProduct.rejected, (state, action) => {
            state.products = []
            state.error = action.error.message
        }),
            builder.addCase(getProductBySlug.pending, (state, action) => {
                state.loading = true
            }),
            builder.addCase(getProductBySlug.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.productBySlug = action.payload
            })
        builder.addCase(getProductBySlug.rejected, (state, action) => {
            state.error = action.error.message
        })
        builder.addCase(getProductByCategory.pending, (state, action) => {
            state.loading = true,
                state.buyerProducts = []
        }),
            builder.addCase(getProductByCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false,
                    state.buyerProducts = action.payload
            })
        builder.addCase(getProductByCategory.rejected, (state, action) => {
            state.buyerProducts = [],
                state.error = action.error.message
        })
        builder.addCase(createProductVariant.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(createProductVariant.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            })
        builder.addCase(createProductVariant.rejected, (state, action) => {
            state.loading = false

        })
        builder.addCase(updateProductVariant.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(updateProductVariant.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            })
        builder.addCase(updateProductVariant.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(updateProductVariantSpec.pending, (state, action) => {

        }),
            builder.addCase(updateProductVariantSpec.fulfilled, (state, action: PayloadAction<any>) => {

            })
        builder.addCase(updateProductVariantSpec.rejected, (state, action) => {

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
        builder.addCase(deleteProductVariant.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(deleteProductVariant.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            })
        builder.addCase(deleteProductVariant.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(elasticSearch.pending, (state, action) => {
            state.loading = true
        }),
            builder.addCase(elasticSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
            })
        builder.addCase(elasticSearch.rejected, (state, action) => {
            
        })
    }
})

export const products = (state: RootState) => state.product.products;
export const productVar = (state: RootState) => state.product.productVariants;
export const buyerProducts = (state: RootState) => state.product.buyerProducts;


export const productBySlug = (state: RootState) => state.product.productBySlug;


export default ProductSlice.reducer;