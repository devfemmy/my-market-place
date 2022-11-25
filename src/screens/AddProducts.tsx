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
import { createProduct, deleteProductVariant, getProductBySlug, getProductVariants, productBySlug, updateProduct } from '../redux/slices/productSlice'
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
import Editor from '../components/resuable/Editor'

const AddProducts = ({ navigation }: any) => {
    const [loader, setLoader] = useState(false)
    const [productInDraft, setProductInDraft] = useState<any>()
    const [size, setSize] = useState(productInDraft?.isSize ? productInDraft?.isSize : false)
    const [color, setColor] = useState(productInDraft?.isColor ? productInDraft?.isColor : false)
    const dispatch = useAppDispatch()
    const productSlug = useAppSelector(productBySlug)
    const [productVar, setProductVar] = useState(productSlug?.variants)
    const [activeId, setActiveId] = useState<any>()
    const [getSlug, setGetSlug] = useState<any>()
    const [colorVariants, setColorVariants] = useState<any>()
    const [colorSizeVariants, setColorSizeVariants] = useState<any>()
    const [colorVariety, setColorVariety] = useState(colorVariants)
    const [colorSizeVariety, setColorSizeVariety] = useState(colorSizeVariants)
    const [responseModal, setResponseModal] = useState(false)
    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const categoryList = useAppSelector(categoryData)
    const [colorAloneVar, setColorAloneVar] = useState([])
    const [prodId, setProdId] = useState<any>()

    const listCate = categoryList?.map(data => {
        return {
            key: data?.id,
            value: data?.category
        }
    })

    const initialValues: ProductFormData = {
        productName: productSlug ? productSlug?.name : "",
        productDescription: productSlug ? productSlug?.description : "",
        category: productSlug ? productSlug?.category : "",
        estimated_delivery_duration: productSlug ? productSlug?.estimated_delivery_duration : ""

    }

    useEffect(() => {
        const loadAsyn = async () => {
            var productInDrafts = await AsyncStorage.getItem('productDraft').then((req: any) => JSON.parse(req))
            var id = await AsyncStorage.getItem('activeId') as string
            var prodId = await AsyncStorage.getItem('prodId') as string
            var slug = await AsyncStorage.getItem('slug') as string
            var colorVariant = await AsyncStorage.getItem('colorVariety').then((req: any) => JSON.parse(req))
            var colorSizeVariant = await AsyncStorage.getItem('colorSizeList').then((req: any) => JSON.parse(req))

            setProductInDraft(productInDrafts)
            setActiveId(id)
            setProdId(prodId)
            setGetSlug(slug)
            setColorVariants(colorVariant)
            setColorSizeVariants(colorSizeVariant)
        }
        loadAsyn()
    }, [productSlug, prodId])

    useEffect(() => {
        dispatch(getAllCategories())
        dispatch(getProductVariants(prodId)).then(dd => {
            console.log({ dd }, dd?.payload)
            var dList = dd?.payload?.map((data: any) => {
                return {
                    img_urls: data?.img_urls[0],
                    product_variant_id: data?.id,
                    size: data?.product_variant_specs[0]?.size,
                    amount: data?.product_variant_specs[0]?.amount,
                    quantity: data?.product_variant_specs[0]?.quantity
                }
            })
            setColorAloneVar(dList)

        })
    }, [productSlug])


    useEffect(() => {
        setProductVar(productSlug?.variants)
    }, [productSlug])

    useEffect(() => {
        dispatch(getProductBySlug(getSlug))
    }, [getSlug])


    const handleFormSubmit = async (data: any) => {
        setLoader(true)
        const payload = {
            isColor: color,
            isSize: size,
        }

        const payloadData = {
            name: data?.productName,
            description: data?.productDescription,
            category_id: data?.category,
            estimated_delivery_duration: parseInt(data?.estimated_delivery_duration),
            store_id: activeId
        }


        await AsyncStorage.setItem('productDraft', JSON.stringify(payload))

        if (getSlug === null) {
            const resultAction = await dispatch(createProduct(payloadData))
            if (createProduct.fulfilled.match(resultAction)) {
                setLoader(false)
                await AsyncStorage.setItem('slug', resultAction?.payload?.data?.slug)
                await AsyncStorage.setItem('prodId', resultAction?.payload?.data?.id)
                return navigation.navigate('AddProductVariant')

            }
            else {
                var errorMess = resultAction?.payload as string
                setLoader(false)
                Notifier.showNotification({
                    title: errorMess,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });

            }
        }
        else {
            setLoader(false)
            return navigation.navigate('AddProductVariant')
        }

    }



    const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
        useFormik({
            initialValues,
            validationSchema: ProductSchema,
            onSubmit: (data: ProductFormData) => handleFormSubmit(data),
            enableReinitialize: true
        });


    const editVariant = async (data: any) => {
        await AsyncStorage.setItem('editableEditId', data?.data?.product_variant_id)
        return navigation.navigate('AddColorVariant')
    }

    const removeVariant = async (data: any) => {
        try {
            var result = await dispatch(deleteProductVariant(data?.product_variant_id))
            if (deleteProductVariant.fulfilled.match(result)) {
                dispatch(getProductVariants(prodId)).then(dd => {

                    var dList = dd?.payload?.map((data: any) => {
                        return {
                            img_urls: data?.img_urls[0],
                            product_variant_id: data?.id,
                            size: data?.product_variant_specs[0]?.size,
                            amount: data?.product_variant_specs[0]?.amount,
                            quantity: data?.product_variant_specs[0]?.quantity
                        }
                    })
                    setColorAloneVar(dList)

                })
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


    const renderColorVariety = () => {
        return colorAloneVar?.map((data: any, i) => {
            return <ProductVariantCard key={i} edit={true} handleDeleteClick={() => removeVariant(data)} handleEditClick={() => editVariant({ data, i })} image={data?.img_urls} name={productSlug?.name} price={data?.amount} />
        })

    }


    const handleRessponseModalClose = () => {
        setResponseModal(false)
        if (type === 'Error') {
            return;
        }
        else {
            return navigation.navigate('Products')
        }
    }


    const handleBothColorAndSize = async () => {
        if (colorAloneVar?.length < 1 || colorAloneVar === undefined) {
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
                id: productSlug?.id,
                name: values?.productName,
                description: values?.productDescription,
                estimated_delivery_duration: parseInt(values?.estimated_delivery_duration),
                category_id: categoryList?.find(item => item?.category === values?.category)?.id,
            }
            var bigRes = await dispatch(updateProduct(payload))
            if (updateProduct.fulfilled.match(bigRes)) {
                await AsyncStorage.removeItem('prodId')
                await AsyncStorage.removeItem('slug')
                await AsyncStorage.removeItem('prodVarId')
                await AsyncStorage.removeItem('productDraft')
                await AsyncStorage.removeItem('editableId')
                setLoader(false)
                Notifier.showNotification({
                    title: 'Product Publish successfully',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                return navigation.navigate('Products')
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



    const addAnotherColor = async () => {
        await AsyncStorage.removeItem('prodVarId')
        return navigation.navigate('AddProductVariant')
    }


    return (
        <View style={styles.container}>
            <MobileHeader
                props={navigation}
                cart
                categoryName="Add Product"
            />
           <ScrollView showsVerticalScrollIndicator={false}>
           <View style={styles.viewContainer}>
                <Text text="Kindly provide product information" fontSize={hp(16)} />
                <Input
                    label='Product Name'
                    value={values.productName}
                    onChangeText={handleChange('productName')}
                    errorMsg={touched.productName ? errors.productName : undefined}
                />
                {/* <Input
                    label='Tell us about your product'
                    multiline={true}
                    numberOfLines={4}
                    onBlur={handleBlur('description')}
                    value={values.productDescription}
                    onChangeText={handleChange('productDescription')}
                    errorMsg={touched.productDescription ? errors.productDescription : undefined}
                /> */}
                <Editor 
                    placeholder='Tell us about your product'
                    value={values.productDescription}
                    onBlur={handleBlur('productDescription')}
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
                    number
                    label='Expected Delivery Duration (Days)'
                    value={values?.estimated_delivery_duration?.toString()}
                    onChangeText={handleChange('estimated_delivery_duration')}
                    errorMsg={touched.estimated_delivery_duration ? errors.estimated_delivery_duration : undefined}
                />

                {
                    !getSlug || getSlug === undefined ? <>
                        <Text text="Size and Colour Options" fontSize={hp(16)} fontWeight='400' style={{ marginTop: hp(20) }} />

                        <View style={styles.div}>
                            <View style={globalStyles.rowBetween}>
                                <Text text="Does your product have sizes?" style={{ marginVertical: hp(5) }} fontSize={hp(16)} fontWeight='400' color={colors.gray} />
                                {
                                    size ? <Pressable onPress={() => setSize(false)}>
                                        <View style={styles.activeBox}><Image source={checkbox} /></View>
                                    </Pressable> : <Pressable onPress={() => setSize(true)}>
                                        <View style={styles.inactiveBox}></View>
                                    </Pressable>
                                }
                            </View>
                        </View>
                        <View style={styles.div}>
                            <View style={globalStyles.rowBetween}>
                                <Text text="Does your product have colours?" fontSize={hp(16)} fontWeight='400' color={colors.gray} />
                                {
                                    color ? <Pressable onPress={() => setColor(false)}>
                                        <View style={styles.activeBox}><Image source={checkbox} /></View>
                                    </Pressable> : <Pressable onPress={() => setColor(true)}>
                                        <View style={styles.inactiveBox}></View>
                                    </Pressable>
                                }
                            </View>
                        </View>
                    </>
                        : null
                }

                {
                    getSlug ? <>
                        <View style={styles.divs}>
                            <Text text='Product Colours' fontSize={hp(14)} fontWeight='400' />
                        </View>
                        <Pressable onPress={() => addAnotherColor()}>
                            <View style={[globalStyles.rowStart, { marginVertical: hp(10) }]} >
                                <Image
                                    source={plusBig}
                                />
                                <Text text='Add Another Colour' color={colors.bazaraTint} fontSize={hp(14)} fontWeight='400' />
                            </View>
                        </Pressable>
                        <ScrollView showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}>
                            {renderColorVariety()}
                        </ScrollView>


                    </> : null
                }
            </View>

            <View style={styles.bottomContainer}>

                {!getSlug || getSlug === undefined ? <Button isLoading={loader} title={"Continue"} onPress={handleSubmit} /> : null}
                {getSlug ? <Button isLoading={loader} title={"Publish"} onPress={handleBothColorAndSize} /> : null}
            </View>
           </ScrollView>

        </View>
    )
}

export default AddProducts


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        paddingTop: hp(30)
    },
    viewContainer: {
        flex: 6,
        paddingHorizontal: hp(10)
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
        paddingHorizontal: hp(10),
        marginTop: hp(50)
    }
})