import { useAppSelector, useAppDispatch } from "../../../../../redux/hooks"
import { images, newSizes, newColours, createProduct } from "../../../../../redux/slices/productSlice"
import { userProfile } from "../../../../../redux/slices/userSilce"
import { ProductCreateFormData } from "../../../../../utils/types"
import { Notify } from "../../../../../utils/functions"


export const handleSizeAlone = async (
    draft: boolean, 
    sizes: Array<any>,
    id: string,
    item_images: Array<string>,
    data: {name: string, description: string, category: string}
    ) => {
    const dispatch = useAppDispatch()
    // const user = useAppSelector(userProfile)[0]
    // const sizes = useAppSelector(newSizes)
    // const item_images = useAppSelector(images)
    const processedImages = item_images.filter((val: string) => {
        if(val != null && val != ''){
            return val
        }
    })
    if(sizes?.length < 1){
        Notify('Failed!', 'Minimum of 1 size option is required', 'error')
        return
    }
    if(processedImages.length < 1){
        Notify('Failed!', 'Minimum of 1 image upload is required', 'error')
        return
    }

    const payload: ProductCreateFormData = {
        id: id,
        name: data?.name,
        description: data?.description,
        categories: data?.category,
        variants: [
            {
                spec: sizes,
                variantImg: processedImages
            }
        ],
        isDraft: draft,
        status: 'active'
    }
    try {
        var resultAction = await dispatch(createProduct(payload))
        if(createProduct.fulfilled.match(resultAction)){
            Notify('Product Added!', 'Your product was successfully added', 'success')
        }else{
            Notify('Product not Added!', 'Your product was not added', 'error')
        }
    } catch (error) {
        Notify('Product not Added!', 'Your product was not added', 'error')
        console.log(error)
    }
}