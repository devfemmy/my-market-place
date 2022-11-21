import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { hp, wp } from '../utils/helpers'
import MobileHeader from './Containers/MobileHeader'
import { Text } from '../components/common'
import { Input } from '../components/common/TextInput'
import { useFormik } from 'formik'
import { ProductFormData } from '../utils/types'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createProduct, deleteProductVariant, getProductBySlug, getProductVariants, productBySlug, products, updateProduct } from '../redux/slices/productSlice'
import { categoryData, getAllCategories } from '../redux/slices/CategorySlice'
import { ProductSchema } from '../utils/schemas'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import ProductVariantCard from './Containers/ProductVariantCard'
import { Select } from '../components/common/SelectInput'
import { globalStyles } from '../styles'
import { colors } from '../utils/themes'
import { checkbox, plus, plusBig } from '../assets'
import { Button } from '../components/common/Button'
import { sizes } from '../utils/constants/sizes'
import { NavigationContainer } from '@react-navigation/native'

const ProductDetailEdit = (props: any) => {
    const productSlug = props?.route?.params?.params?.slug
    const dispatch = useAppDispatch()
    const productList = useAppSelector(products)
    const categoryList = useAppSelector(categoryData)
    const productBySlugData = useAppSelector(productBySlug)
    const [id, setId] = useState<any>()


    useEffect(() => {
        async () => {
            var id = await AsyncStorage.getItem('activeId') as string
            setId(id)
        }
    }, [id])

    useEffect(() => {
        dispatch(getProductBySlug(productSlug))
    }, [productSlug, id])


    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    const [loader, setLoader] = useState(false)

    const listCate = categoryList?.map(data => {
        return {
            key: data?.id,
            value: data?.category
        }
    })

    const initialValues: ProductFormData = {
        productName: productBySlugData?.name,
        productDescription: productBySlugData?.description,
        category: productBySlugData?.category,
        estimated_delivery_duration: productBySlugData?.estimated_delivery_duration
    };

    const handleFormSubmit = async (data: any) => {
        
        if (productBySlugData?.product_variants?.length < 1 || productBySlugData?.product_variants === undefined) {
            Notifier.showNotification({
                title: 'Minimum of 1 color spec is required',
                description: '',
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        try {
            setLoader(true)
            const payload = {
                id: productBySlugData?.id,
                name: data?.productName,
                description: data?.productDescription,
                estimated_delivery_duration: parseInt(data?.estimated_delivery_duration),
                category_id: categoryList?.find(item => item?.category === data?.category)?.id,
            }
           
            var bigRes = await dispatch(updateProduct(payload))
            if (updateProduct.fulfilled.match(bigRes)) {
                await AsyncStorage.removeItem('prodEditId')
                await AsyncStorage.removeItem('slugEdit')
                await AsyncStorage.removeItem('prodEditVarId')
                await AsyncStorage.removeItem('productEditInDraft')
                await AsyncStorage.removeItem('editableEditId')
                Notifier.showNotification({
                    title: 'Product updated successfully',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });

                setLoader(false)
                return props.navigation.navigate('Products')
            }
            else {
                var errMsg = bigRes?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
                setLoader(false)
                return
            }
        }
        catch (e) {
            console.log({ e })
        }
    }

    var isColorPresent = productBySlugData?.product_variants.some((vd: any) => vd['color'] === null)
    var isSizePresent = productBySlugData?.product_variants.some((vd: any) => vd?.product_variant_specs?.some((md: any) => md['size'] === null))


    const addAnotherColor = async () => {
        const productInDraft = {
            isColor: !isColorPresent,
            isSize: !isSizePresent,
        }
        await AsyncStorage.setItem('productEditInDraft', JSON.stringify(productInDraft))
        await AsyncStorage.removeItem('editableEditId')
        await AsyncStorage.removeItem('prodEditVarId')
        await AsyncStorage.removeItem('editableId')
        await AsyncStorage.setItem('prodEditId', productBySlugData?.id)
        await AsyncStorage.setItem('slugEdit', productSlug)
        return props.navigation.navigate('ProductDetailEditVariant', {
            params: {
                slug: productSlug,
                productEditInDraft: productInDraft,
                prodEditId: productSlug,
                activeId: id
            }
        })


    }

    const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
        useFormik({
            initialValues,
            validationSchema: ProductSchema,
            onSubmit: (data: ProductFormData) => handleFormSubmit(data),
            enableReinitialize: true
        });



    const editVariant = async (data: any) => {
        var isColorPresent = productBySlugData?.product_variants.some((vd: any) => vd['color'] === null)
        var isSizePresent = productBySlugData?.product_variants.some((vd: any) => vd?.product_variant_specs?.some((md: any) => md['size'] === null))

        const productInDraft = {
            isColor: !isColorPresent,
            isSize: !isSizePresent,
        }
        await AsyncStorage.removeItem('editableId')
        await AsyncStorage.setItem('productEditInDraft', JSON.stringify(productInDraft))
        await AsyncStorage.setItem('editableEditId', data?.id)
        await AsyncStorage.setItem('prodEditVarId', data?.id)
        await AsyncStorage.setItem('slugEdit', productSlug)


        return props.navigation.navigate('ColorEditVariant', {
            params: {
                productEditInDraft: productInDraft,
                editableEditId: data?.id,
                prodEditVarId: data?.id,
                slugEdit: productSlug
            }
        })
    }

    const removeVariant = async (data: any) => {
        try {
            var result = await dispatch(deleteProductVariant(data?.id))
            if (deleteProductVariant.fulfilled.match(result)) {
                dispatch(getProductBySlug(productSlug))
            }
            else {
                var errMsg = result?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            }
        }
        catch (e) {
            console.log({ e })
        }
    }









    return (
        <View style={styles.container}>
            <MobileHeader
                props={props}
                categoryName='Edit Product'
            />
            <View style={styles.viewContainer}>
                <Text text="Kindly provide product information" fontSize={hp(16)} />
                <Input
                    label='Product Name'
                    value={values.productName}
                    onChangeText={handleChange('productName')}
                    errorMsg={touched.productName ? errors.productName : undefined}
                />
                <Input
                    label='Tell us about your product'
                    multiline={true}
                    numberOfLines={4}
                    onBlur={handleBlur('description')}
                    value={values.productDescription}
                    onChangeText={handleChange('productDescription')}
                    errorMsg={touched.productDescription ? errors.productDescription : undefined}
                />
                <Select
                    items={listCate}
                    defaultValue={values.category}
                    placeholder={'category'}
                    setState={handleChange('category')}
                    errorMsg={touched.category ? errors.category : undefined}
                />
                <Input
                    label='Expected Delivery Duration'
                    value={values?.estimated_delivery_duration.toString()}
                    onChangeText={handleChange('estimated_delivery_duration')}
                    errorMsg={touched.estimated_delivery_duration ? errors.estimated_delivery_duration : undefined}
                />
                <View style={styles.divs}>
                    <Text text='Product Colours' fontSize={hp(14)} fontWeight='400' />
                </View>


                <View style={styles.subdiv}>
                    {
                        productBySlugData?.product_variants?.map((data: any, i: number) => {
                            return <ProductVariantCard edit key={i} handleDeleteClick={() => removeVariant(data)} handleEditClick={() => editVariant(data)} name={productBySlugData?.name} price={data?.product_variant_specs[0]?.amount} image={data?.img_urls[0]} />
                        })
                    }
                </View>
                {
                    (isColorPresent && isSizePresent) || (isColorPresent && !isSizePresent) ? null : <Pressable onPress={() => addAnotherColor()}>
                        <View style={globalStyles.rowStart}>
                            <Image
                                source={plusBig}
                            />
                            <Text text='Add Another Variant' color={colors.bazaraTint} fontSize={hp(14)} fontWeight='400' />
                        </View>
                    </Pressable>
                }

            </View>

            <View style={styles.bottomContainer}>
                <Button isLoading={loader} title='Update Product' onPress={handleSubmit} />
            </View>

        </View>
    )
}

export default ProductDetailEdit


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        paddingTop: hp(30)
    },
    viewContainer: {
        flex: 6,
    },
    div: {
        paddingVertical: hp(5)
    },
    activeBox: {
        width: wp(20),
        height: hp(20),
        alignItems: 'center',
        backgroundColor: colors.bazaraTint,
        borderRadius: 5
    },
    inactiveBox: {
        width: wp(20),
        height: hp(20),
        alignItems: 'center',
        backgroundColor: colors.darkBlack,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors?.white
    },
    img: {

    },
    divs: {
        backgroundColor: colors.artBoard,
        padding: hp(5),
        marginBottom: hp(10)
    },
    bottomContainer: {
        flex: 1,
    },
    subdiv: {
        backgroundColor: colors.darkBlack,
        padding: hp(10),
        borderRadius: 10,
        marginTop: hp(5)
    }
})