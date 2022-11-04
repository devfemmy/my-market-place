import { View, StyleSheet, Pressable, Image, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { createProductVariant, createProductVariantSpec, deleteProductVariantSpec, getProductBySlug, getProductVariantSpec, productBySlug, updateProductVariant, updateProductVariantSpec } from '../redux/slices/productSlice'
import { ProductColorAloneData, ProductColorData, ProductNoColorData, ProductSizeData } from '../utils/types'
import { sizes } from '../utils/constants/sizes'
import { useFormik } from 'formik'
import { ProductColorAloneSchema, ProductColorSchema, ProductNoColorSchema, ProductSizeSchema } from '../utils/constants'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { NavigationContainer } from '@react-navigation/native'
import { hp, numberFormat, wp } from '../utils/helpers'
import { colors } from '../utils/themes'
import { globalStyles } from '../styles'
import { cancel, del, edits, plus, plusBig, remove } from '../assets'
import { Text } from '../components/common'
import ImagePicker from 'react-native-image-crop-picker';
import { pictureUpload } from '../utils/functions'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/TextInput'
import RBSheet from "react-native-raw-bottom-sheet";
import MobileHeader from './Containers/MobileHeader'
import ImageUploadComponent from './Containers/ImageUploadComponent'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Select } from '../components/common/SelectInput'





const ColorEditVariant = (props: any) => {

    const [editableItem, setEditableItem] = useState<any>(props?.route.params.params.editableEditId)
    const [slug, setSlug] = useState<any>(props?.route.params.params.slugEdit)
    const [dummyUploadImage, setDummyUploadImage] = useState([""])
    const [specId, setSpecId] = useState("")
    const [openCrop, setOpenCrop] = useState(false)
    const [photoUrl, setPhotoUrl] = useState<any>()
    const [file, setFile] = useState(null)
    const [productInDraft, setProductInDraft] = useState<any>(props?.route.params.params.productEditInDraft)
    const [editSizeData, setEditSizeData] = useState<{ amount: number, size: string }>()
    const dispatch = useAppDispatch()
    const [sizeLists, setSizeLists] = useState([])
    const [responseModal, setResponseModal] = useState(false)
    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [prodVarId, setProdVarId] = useState<any>(props?.route.params.params.prodEditVarId)
    const [loader, setLoader] = useState(false)
    const productSlug = useAppSelector(productBySlug)
    const [imageUrl, setImageUrl] = useState([])
    const [multiple, setMultiple] = useState(true)
    const [editDataId, setEditDataId] = useState('')
    const [description, setDescription] = useState("")
    const [multipleUpload, setMultipleUpload] = useState<any>([])
    const [activeId, setActiveId] = useState<any>()
    const [prodId, setProdId] = useState<any>()
    const refRBSheet = useRef();

    const modalInitialValues: ProductSizeData = {
        price: editSizeData ? editSizeData?.amount : 0,
        size: editSizeData ? editSizeData?.size : "Select new Size",
    };
    const [modalQuantity, setModalQuantity] = useState(1)
    const [size, setSize] = useState(sizes)

    const [color, setColor] = useState()
    const [price, setPrice] = useState<number>()
    const [quantity, setQuantity] = useState<any>()
    const [imageLoader, setImageLoader] = useState(false)
    const newSize = size?.map(data => {
        return {
            key: data?.type,
            value: data?.type
        }
    })


    useEffect(() => {
        const loadAsyn = async () => {
            var productInDrafts = await AsyncStorage.getItem('productEditInDraft').then((req: any) => JSON.parse(req))
            var id = await AsyncStorage.getItem('activeId') as string
            var editId = await AsyncStorage.getItem('editableEditId') as string
            var prodId = await AsyncStorage.getItem('prodEditId') as string
            var slug = await AsyncStorage.getItem('slugEdit') as string
            var variant = await AsyncStorage.getItem('prodEditVarId') as string

            setProductInDraft(productInDrafts)
            setActiveId(id)
            setProdId(prodId)
            setEditableItem(editId)
            setSlug(slug)
            setSlug(slug)
            setProdVarId(variant)

        }
        loadAsyn()
    }, [activeId])


    useEffect(() => {
        const loadData = async () => {
            dispatch(getProductBySlug(slug)).then(dd => {
                var filterData = dd?.payload?.product_variants?.find((dat: any) => dat?.id === editableItem)
                console.log({filterData}, productInDraft?.isColor,productInDraft?.isSize)
                if (productInDraft?.isColor && !productInDraft?.isSize) {
                    setMultipleUpload(filterData?.img_urls)
                    setDummyUploadImage([...filterData?.img_urls, ""])
                    setPrice(filterData?.product_variant_specs[0]?.amount)
                    setQuantity(filterData?.product_variant_specs[0]?.quantity)
                    setSpecId(filterData?.product_variant_specs[0]?.id)
                    setDescription(filterData?.color)
                    return
                }

                if (!productInDraft?.isColor && !productInDraft?.isSize) {
                    setMultipleUpload(filterData?.img_urls)
                    setDummyUploadImage([...filterData?.img_urls, ""])
                    setPrice(filterData?.product_variant_specs[0]?.amount)
                    setQuantity(filterData?.product_variant_specs[0]?.quantity)
                    setSpecId(filterData?.product_variant_specs[0]?.id)
                    return
                }

                if (!productInDraft?.isColor && productInDraft?.isSize) {
                    setMultipleUpload(filterData?.img_urls)
                    setDummyUploadImage([...filterData?.img_urls, ""])
                    setSizeLists(filterData?.product_variant_specs)
                    return

                }

                if (productInDraft?.isColor && productInDraft?.isSize) {
                    setMultipleUpload(filterData?.img_urls)
                    setColor(filterData?.color)
                    setDummyUploadImage([...filterData?.img_urls, ""])
                    setSizeLists(filterData?.product_variant_specs)
                    return
                }
            })

        }

        loadData()

    }, [editableItem, slug])


    const pickImage = async (index: number) => {
        ImagePicker.openPicker({
            width: 500,
            height: 600,
            cropping: true,
            mediaType: "photo",
            multiple: false,
        }).then(async image => {
            setImageLoader(true)
            const ImageUrl = await pictureUpload(image)
            setMultipleUpload([...multipleUpload, ImageUrl])
            setDummyUploadImage([...dummyUploadImage, ""])
            setImageLoader(false)
        });
    };

    const removeImage = (index: any) => {
        const update = multipleUpload?.filter((data: any, i: number) => i !== index)
        setMultipleUpload(update)
        const popData = dummyUploadImage.slice(0, -1);
        setDummyUploadImage(popData)
    }

    const _initialValues: ProductColorData = {
        description: color ? color : ''
    };

    const init: ProductColorAloneData = {
        price: price ? price : 0,
        description: description ? description : ''
    };

    const initialValues: ProductNoColorData = {
        price: price ? price : 0
    };


    const handleFormSubmit = async (data: any) => {
        if (multipleUpload?.length < 1 || multipleUpload === undefined) {
            Notifier.showNotification({
                title: 'Minimum of 1 image upload is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        if (_values.description?.length < 1) {
            Notifier.showNotification({
                title: 'Color description is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        if (sizeLists?.length < 1) {
            Notifier.showNotification({
                title: 'Minimum of 1 size is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        setLoader(true)
        try {
            const pData = {
                img_urls: multipleUpload,
                color: data?.description,
                id: editableItem,
            }
            var bigR = await dispatch(updateProductVariant(pData))
            if (updateProductVariant.fulfilled.match(bigR)) {
                setLoader(false)
                props.navigation.goBack()
            }
            else {
                var errMsg = bigR?.payload as string
                setLoader(false)
                Notifier.showNotification({
                    title: errMsg,
                    // description: "tghdddfdfd",
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



    const showModal = async () => {
        if (multipleUpload?.length < 1 || multipleUpload === undefined) {
            Notifier.showNotification({
                title: 'Minimum of 1 image upload is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        if (_values.description?.length < 1) {
            Notifier.showNotification({
                title: 'Color description is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }

        if (prodVarId) {
            // setIsModalVisible(true);
            refRBSheet.current.open()
            return;
        }
        else {
            const payload = {
                img_urls: multipleUpload,
                color: _values.description,
                product_id: productSlug?.id
            }
            try {
                var result = await dispatch(createProductVariant(payload))
                if (createProductVariant.fulfilled.match(result)) {
                    await AsyncStorage.setItem('prodEditVarId', result?.payload?.data?.id)
                    setProdVarId(result?.payload?.data?.id)
                    // setIsModalVisible(true);
                    refRBSheet.current.open()
                    setLoader(false)
                }
                else {
                    var errMsg = result?.payload as string
                    Notifier.showNotification({
                        title: errMsg,
                        // description: "tghdddfdfd",
                        Component: NotifierComponents.Alert,
                        hideOnPress: false,
                        componentProps: {
                            alertType: 'error',
                        },
                    });
                    setLoader(false)
                }
            }
            catch (e) {
                console.log({})
            }
        }
    };

    const showModal2 = async () => {
        if (multipleUpload?.length < 1 || multipleUpload === undefined) {
            Notifier.showNotification({
                title: 'Minimum of 1 image upload is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }

        if (prodVarId) {
            // setIsModalVisible(true);
            refRBSheet.current.open()
            return;
        }
        else {
            const payload = {
                img_urls: multipleUpload,
                product_id: productSlug?.id
            }
            try {
                var result = await dispatch(createProductVariant(payload))
                if (createProductVariant.fulfilled.match(result)) {
                    await AsyncStorage.setItem('prodEditVarId', result?.payload?.data?.id)
                    setProdVarId(result?.payload?.data?.id)
                    // setIsModalVisible(true);
                    refRBSheet.current.open()
                    setLoader(false)
                }
                else {
                    var errMsg = result?.payload as string
                    Notifier.showNotification({
                        title: errMsg,
                        // description: "tghdddfdfd",
                        Component: NotifierComponents.Alert,
                        hideOnPress: false,
                        componentProps: {
                            alertType: 'error',
                        },
                    });
                    setLoader(false)
                }
            }
            catch (e) {
                console.log({})
            }
        }
    };

    const deleteSize = async (info: any) => {
        try {
            var result = await dispatch(deleteProductVariantSpec(info))
            if (deleteProductVariantSpec.fulfilled.match(result)) {
                dispatch(getProductVariantSpec(editableItem)).then(data => {
                    setSizeLists(data?.payload)
                })
            }
            else {
                var errMsg = result?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    // description: "tghdddfdfd",
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


    const editSize = (data: any, index: any) => {
        setModalQuantity(data?.quantity)
        setEditSizeData({ size: data?.size, amount: data?.amount })
        setEditDataId(data?.id)
        showModal()
    }

    const handleCancel = () => {
        // setIsModalVisible(false)
        refRBSheet.current.close()
        setEditDataId('')
        setEditSizeData(null)
    };

    const modalIncrement = () => {
        const qt = modalQuantity + 1
        setModalQuantity(qt)
    }

    const modalDecrement = () => {
        if (modalQuantity === 1) {
            return;
        }
        const qt = modalQuantity - 1
        setModalQuantity(qt)
    }

    const renderSizeList = () => {
        return sizeLists?.map((data: any, i: number) => {
            return (
                <View style={styles.minidiv} key={i}>
                    <View style={globalStyles.rowStart}>
                        <Text text='Size: ' fontSize={hp(14)} fontWeight='400' style={{ marginTop: hp(10), marginRight: hp(10) }} color={colors.gray} />
                        <Text text={data?.size} fontSize={hp(14)} fontWeight='400' style={{ marginTop: hp(10) }} />
                    </View>
                    <View style={globalStyles.rowStart}>
                        <Text text='Price: ' fontSize={hp(14)} fontWeight='400' style={{ marginTop: hp(10), marginRight: hp(10) }} color={colors.gray} />
                        <Text
                            text={`₦${numberFormat(Number(data?.amount) || 0)}`}
                            fontSize={hp(14)}
                            numberOfLines={1}
                            fontWeight={'600'}
                        />
                    </View>
                    <View style={globalStyles.rowBetween}>
                        <View style={styles.contDiv}>
                            <View style={globalStyles.rowStart}>
                                <Text text='Quantity: ' fontSize={hp(14)} fontWeight='400' style={{ marginTop: hp(10), marginRight: hp(10) }} color={colors.gray} />
                                <Text text={`${data.quantity} item(s)`} fontSize={hp(14)} fontWeight='400' style={{ marginTop: hp(10) }} />
                            </View>
                        </View>
                        <View style={globalStyles.rowStart}>
                            <Pressable onPress={() => editSize(data, i)}>
                                <Image source={edits} />
                            </Pressable>
                            <Text text='' style={{ marginHorizontal: hp(5) }} />
                            <Pressable onPress={() => deleteSize(data?.id)}>
                                <Image source={del} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            )
        })
    }



    const handleModalFormSubmit = async (data: any) => {

        if (data?.size === "Select new Size") {
            Notifier.showNotification({
                title: 'Size is Required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return;
        }
        const payload = {
            size: data?.size,
            amount: parseInt(data?.price),
            quantity: modalQuantity,
            product_variant_id: editableItem
        }

        const editPayload = {
            size: data?.size,
            amount: parseInt(data?.price),
            quantity: modalQuantity,
            product_variant_spec_id: editDataId
        }
        setLoader(true)
        if (editSizeData) {
            const pData = {
                img_urls: multipleUpload,
                id: editableItem,
            }
            try {
                var bigR = await dispatch(updateProductVariant(pData))
                if (updateProductVariant.fulfilled.match(bigR)) {
                    var result = await dispatch(updateProductVariantSpec(editPayload))
                    if (updateProductVariantSpec.fulfilled.match(result)) {
                        dispatch(getProductBySlug(slug)).then(dd => {
                            var filterData = dd?.payload?.product_variants?.find((data: any) => data?.id === editableItem)
                            if (filterData === undefined) {
                                return;
                            }
                            setColor(filterData?.color)
                            setMultipleUpload(filterData?.img_urls)
                            setDummyUploadImage([...filterData?.img_urls, ""])
                            setSizeLists(filterData?.product_variant_specs)
                            handleCancel()
                            modalResetForm()
                            setModalQuantity(1)
                            setLoader(false)
                        })

                    }
                    else {
                        var errMsg = result?.payload as string
                        Notifier.showNotification({
                            title: errMsg,
                            // description: "tghdddfdfd",
                            Component: NotifierComponents.Alert,
                            hideOnPress: false,
                            componentProps: {
                                alertType: 'error',
                            },
                        });
                        setLoader(false)
                    }
                }
                else {
                    var errMsg = bigR?.payload as string
                    Notifier.showNotification({
                        title: errMsg,
                        // description: "tghdddfdfd",
                        Component: NotifierComponents.Alert,
                        hideOnPress: false,
                        componentProps: {
                            alertType: 'error',
                        },
                    });
                    setLoader(false)
                }

            }
            catch (e) {
                console.log({ e })
            }
        }
        else {
            try {
                const pData = {
                    img_urls: multipleUpload,
                    id: editableItem
                }
                var bigR = await dispatch(updateProductVariant(pData))
                if (updateProductVariant.fulfilled.match(bigR)) {
                    var results = await dispatch(createProductVariantSpec(payload))
                    if (createProductVariantSpec.fulfilled.match(results)) {
                        dispatch(getProductBySlug(slug)).then(dd => {
                            var filterData = dd?.payload?.product_variants?.find((data: any) => data?.id === editableItem)
                            if (filterData === undefined) {
                                return;
                            }
                            setColor(filterData?.color)
                            setMultipleUpload(filterData?.img_urls)
                            setDummyUploadImage([...filterData?.img_urls, ""])
                            setSizeLists(filterData?.product_variant_specs)
                            handleCancel()
                            modalResetForm()
                            setModalQuantity(1)
                            setLoader(false)
                        })

                    }
                    else {
                        var errMsg = results?.payload as string
                        Notifier.showNotification({
                            title: errMsg,
                            // description: "tghdddfdfd",
                            Component: NotifierComponents.Alert,
                            hideOnPress: false,
                            componentProps: {
                                alertType: 'error',
                            },
                        });
                        setLoader(false)
                    }
                }
            }
            catch (e) {
                console.log({ e })
            }
        }

    }

    const increment = () => {
        const qt = quantity + 1
        setQuantity(qt)
    }

    const decrement = () => {
        if (quantity === 1) {
            return
        }
        const qt = quantity - 1
        setQuantity(qt)
    }

    const sizeAloneSubmission = async () => {
        if (multipleUpload?.length < 1 || multipleUpload === undefined) {
            Notifier.showNotification({
                title: 'Minimum of 1 image upload is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        if (sizeLists?.length < 1 || sizeLists === undefined) {
            Notifier.showNotification({
                title: 'Minimum of 1 size is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        const payload = {
            img_urls: multipleUpload,
            id: editableItem
        }
        setLoader(true)
        try {
            var bigR = await dispatch(updateProductVariant(payload))
            if (updateProductVariant.fulfilled.match(bigR)) {
                return props.navigation.goBack()
            }
            else {
                var errMsg = bigR?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    // description: "tghdddfdfd",
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

    const handleColorAlonePublish = async (data: any) => {
        if (multipleUpload?.length < 1 || multipleUpload === undefined) {
            Notifier.showNotification({
                title: 'Minimum of 1 image upload is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        if (description?.length < 1) {
            Notifier.showNotification({
                title: 'Color type is required',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }
        const payload = {
            img_urls: multipleUpload,
            color: description,
            id: editableItem
        }
        setLoader(true)
        try {
            var bigR = await dispatch(updateProductVariant(payload))
            if (updateProductVariant.fulfilled.match(bigR)) {
                const payloadData = {
                    product_variant_spec_id: specId,
                    quantity: quantity,
                    amount: parseInt(data?.price)
                }

                var res = await dispatch(updateProductVariantSpec(payloadData))
                if (updateProductVariantSpec.fulfilled.match(res)) {
                    Notifier.showNotification({
                        title: 'Product variant updated successfull',
                        // description: "tghdddfdfd",
                        Component: NotifierComponents.Alert,
                        hideOnPress: false,
                        componentProps: {
                            alertType: 'success',
                        },
                    });
                    setLoader(false)
                    return props.navigation.goBack()
                }
                else {
                    var errMsg = res?.payload as string
                    setLoader(false)
                    Notifier.showNotification({
                        title: errMsg,
                        // description: "tghdddfdfd",
                        Component: NotifierComponents.Alert,
                        hideOnPress: false,
                        componentProps: {
                            alertType: 'error',
                        },
                    });
                }
            }
            else {
                var errMsg = bigR?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    // description: "tghdddfdfd",
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

    const handleNoColorFormSubmit = async (data: any) => {
        if (multipleUpload?.length < 1) {
            setResponseModal(true)
            setTitle('Minimum of 1 image upload is required')
            setType('Error')
            return
        }
        const payload = {
            img_urls: multipleUpload,
            id: prodVarId
        }
        setLoader(true)
        try {
            var result = await dispatch(updateProductVariant(payload))
            if (updateProductVariant.fulfilled.match(result)) {
                var newPayload = {
                    amount: parseInt(data?.price),
                    quantity: quantity,
                    product_variant_spec_id: specId
                }
                var secondResult = await dispatch(updateProductVariantSpec(newPayload))
                if (updateProductVariantSpec.fulfilled.match(secondResult)) {
                    setLoader(false)
                    return props.navigation.goBack()
                }
                else {
                    var errMsg = secondResult?.payload as string
                    Notifier.showNotification({
                        title: errMsg,
                        // description: "tghdddfdfd",
                        Component: NotifierComponents.Alert,
                        hideOnPress: false,
                        componentProps: {
                            alertType: 'error',
                        },
                    });
                    setLoader(false)
                }

            }
            else {
                var errMsg = result?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    // description: "tghdddfdfd",
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




    const { values: _values, errors: _errors, touched: _touched, handleChange: _handleChange, handleSubmit: _handleSubmit, handleBlur: _handleBlur } =
        useFormik({
            initialValues: _initialValues,
            validationSchema: ProductColorSchema,
            onSubmit: (data: { description: string }) => handleFormSubmit(data),
            enableReinitialize: true
        });

    const { values: modalValues, errors: modalErrors, touched: modalTouched, handleChange: modalHandleChange, handleSubmit: modalHandleSubmit, handleBlur: modalHandleBlur, resetForm: modalResetForm } =
        useFormik({
            initialValues: modalInitialValues,
            validationSchema: ProductSizeSchema,
            onSubmit: (data: ProductSizeData) => handleModalFormSubmit(data),
            enableReinitialize: true
        });

    const { values: colorValues, errors: colorErrors, touched: colorTouched, handleChange: colorHandleChange, handleSubmit: colorHandleSubmit, handleBlur: colorHandleBlur, resetForm: colorResetForm } =
        useFormik({
            initialValues: init,
            validationSchema: ProductColorAloneSchema,
            onSubmit: (data: ProductColorAloneData) => handleColorAlonePublish(data),
            enableReinitialize: true
        });

    const { values, errors, touched, handleChange, handleSubmit, handleBlur, resetForm } =
        useFormik({
            initialValues,
            validationSchema: ProductNoColorSchema,
            onSubmit: (data: ProductNoColorData) => handleNoColorFormSubmit(data),
            enableReinitialize: true
        });





    return (
        <View style={styles.container}>
            <MobileHeader
                props={props}
                categoryName='Product Details'
            />
            <View style={styles.columnContainer}>
                <Text text='Upload Images' fontSize={hp(16)} fontWeight='400' />

                {
                    multipleUpload?.length < 1 || multipleUpload === undefined ? <ImageUploadComponent single profileImageChange={pickImage} imageLoader={imageLoader} />
                        :
                        <View style={styles.rowStart}>
                            {
                                multipleUpload?.map((item: any, i: number) => {
                                    return <View style={styles.rowStart}>
                                        <View>
                                            <Pressable onPress={() => removeImage(i)}>
                                                <Image source={remove} style={styles.img2} />
                                            </Pressable>
                                            <Image source={{ uri: item }} style={styles.multContainer} />
                                        </View>

                                    </View>
                                })
                            }
                            {
                                dummyUploadImage?.filter((a, b) => multipleUpload?.length < b + 1 && multipleUpload?.length < 6).map((data, i) => {
                                    return <Pressable onPress={() => pickImage(i)}>
                                        <View style={styles.multContainer2}>
                                            {
                                                imageLoader ? <AntDesign name='loading1' color={'white'} /> :
                                                    <Image source={plus} style={styles.img} />
                                            }

                                        </View>

                                    </Pressable>
                                })
                            }

                        </View>

                }

                {/* No size no color */}
                {
                    !productInDraft?.isColor && !productInDraft?.isSize && <>
                        <Input
                            style={styles.price}
                            label='Price'
                            // type='controlled'
                            value={values.price.toString()}
                            onChangeText={handleChange('price')}
                            errorMsg={touched.price ? errors.price : undefined}
                        />
                        <View style={globalStyles.rowStart}>
                            <View style={styles.subdiv}>
                                <Input
                                    label='Quantity'
                                    // type='controlled'
                                    value={quantity?.toString()}
                                    onChangeText={(e: any) => setQuantity(e)}
                                    errorMsg={touched.price ? errors.price : undefined}
                                />
                            </View>
                            <Pressable onPress={() => decrement()}>
                                <View style={styles.quantitydiv} >
                                    <Text text='-' fontSize={hp(30)} />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => increment()}>
                                <View style={styles.quantitydiv} >
                                    <Text text='+' fontSize={hp(30)} />
                                </View>
                            </Pressable>

                        </View>
                    </>
                }

                {/* No color but dere is size */}
                {
                    productInDraft?.isSize && !productInDraft?.isColor && <>
                        <Text text='Size Options' fontSize={hp(16)} fontWeight='400' />
                        <ScrollView>
                            <View style={styles.bigDiv}>
                                {renderSizeList()}
                            </View>
                            <Pressable onPress={showModal}>
                                <View style={globalStyles.rowStart}>
                                    <Image
                                        source={plusBig}
                                        style={styles.plus}
                                    />
                                    <Text text='Add Sizes' color={colors.bazaraTint} fontSize={hp(14)} fontWeight='400' style={{ marginLeft: hp(5) }} />
                                </View>
                            </Pressable>
                        </ScrollView>

                    </>
                }


                {/* There is color but no size */}

                {
                    productInDraft?.isColor && !productInDraft?.isSize && <>
                        <Input
                            label='Color'
                            value={colorValues.description}
                            onChangeText={colorHandleChange('description')}
                            errorMsg={colorTouched.description ? colorErrors.description : undefined}
                        />

                        <Input
                            label='Price'
                            value={colorValues.price.toString()}
                            onChangeText={colorHandleChange('price')}
                            errorMsg={colorTouched.price ? colorErrors.price : undefined}
                        />

                        <View style={styles.rowStart}>
                            <View style={styles.subdiv}>
                                <Input
                                    label='Quantity'
                                    // type='controlled'
                                    value={quantity?.toString()}
                                />
                            </View>
                            <Pressable onPress={() => decrement()}>
                                <View style={styles.quantitydiv2} >
                                    <Text text='-' fontSize={hp(30)} />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => increment()}>
                                <View style={styles.quantitydiv2} >
                                    <Text text='+' fontSize={hp(30)} />
                                </View>
                            </Pressable>
                        </View>

                    </>
                }


                {/* Both size and color true */}
                {
                    productInDraft?.isColor && productInDraft?.isSize && <>
                        <Input
                            label='Color Description'
                            value={_values.description}
                            onChangeText={_handleChange('description')}
                            errorMsg={_touched.description ? _errors.description : undefined}
                        />
                        <Text text='Colour Sizes' fontSize={hp(16)} fontWeight='400' />
                       <ScrollView>
                       {
                            renderSizeList()
                        }
                       </ScrollView>
                        <Pressable onPress={showModal2}>
                            <View style={globalStyles.rowStart}>
                                <Image
                                    source={plusBig}
                                />
                                <Text text='Add Sizes' fontSize={hp(14)} fontWeight='400' style={{ marginLeft: hp(5) }} />
                            </View>
                        </Pressable>
                        {/* <View style={styles.br}></View> */}
                    </>
                }


            </View>

            <View style={styles.bottomContainer}>
                {!productInDraft?.isColor && !productInDraft?.isSize && <Button isLoading={loader} title={"Update"} onPress={handleSubmit} />}
                {productInDraft?.isColor && productInDraft?.isSize && <Button isLoading={loader} title={"Update"} onPress={_handleSubmit} />}
                {!productInDraft?.isColor && productInDraft?.isSize && <Button isLoading={loader} title={"Update"} onPress={sizeAloneSubmission} />}
                {productInDraft?.isColor && !productInDraft?.isSize && <Button isLoading={loader} title={"Update"} onPress={colorHandleSubmit} />}
            </View>


            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={400}
                animationType='slide'
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: colors.bazaraTint
                    },
                    container: {
                        backgroundColor: 'black',
                        height: hp(400)
                    }
                }}
            >
                <View style={styles.sheet}>
                    <View style={[globalStyles.rowBetween]}>
                        <Text text='Size Details' fontSize={hp(16)} fontWeight='600' />
                        <Pressable onPress={handleCancel}>
                            <View>
                                <Image source={cancel} />
                            </View>
                        </Pressable>
                    </View>

                    <View style={styles.columnContainer2}>
                        <Select
                            placeholder='Select Size'
                            items={newSize}
                            defaultValue={modalValues.size}
                            setState={modalHandleChange('size')}
                            errorMsg={modalTouched.size ? modalErrors.size : undefined}
                        />
                        <View style={styles.mins}></View>
                        <Input
                            style={{ marginTop: hp(5) }}
                            label='Price'
                            value={modalValues.price.toString()}
                            onChangeText={modalHandleChange('price')}
                            errorMsg={modalTouched.price ? modalErrors.price : undefined}
                        />
                        <View style={globalStyles.rowStart}>
                            <View style={styles.subdiv}>
                                <Input
                                    label='Quantity'
                                    value={modalQuantity?.toString()}
                                />
                            </View>
                            <Pressable onPress={() => modalDecrement()}>
                                <View style={styles.quantitydiv} >
                                    <Text text='-' fontSize={hp(30)} />
                                </View>
                            </Pressable>
                            <Pressable onPress={() => modalIncrement()}>
                                <View style={styles.quantitydiv} >
                                    <Text text='+' fontSize={hp(30)} />
                                </View>
                            </Pressable>
                        </View>
                        <Button isLoading={loader} title={editSizeData ? "Update" : "Save and add new"} onPress={modalHandleSubmit} />
                    </View>

                </View>
            </RBSheet>
        </View>
    )
}

export default ColorEditVariant


const styles = StyleSheet.create({
    minidiv: {
        paddingVertical: hp(10),
        borderBottomWidth: 1,
        borderBottomColor: colors.darkBlack
    },
    container: {
        width: '100%',
        paddingTop: hp(10),
        paddingHorizontal: hp(15),
        backgroundColor: 'black',
        flex: 1
    },
    columnContainer: {
        flex: 12
    },
    bottomContainer: {
        flex: 1,
    },
    br: {
        width: '100%',
        height: hp(1),
        backgroundColor: colors.gray
    },
    br2: {
        width: '100%',
        height: hp(1),
        marginVertical: hp(5),
        backgroundColor: colors.lightGray
    },
    img: {
        width: wp(30),
        height: hp(30)
    },
    img2: {
        width: wp(15),
        height: hp(15),
        position: 'absolute',
        top: 20,
        right: 20,
    },
    multContainer: {
        width: wp(100),
        height: hp(120),
        backgroundColor: colors.artBoard,
        marginVertical: hp(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: hp(15),
        zIndex: -3,
        elevation: -3

    },
    multContainer2: {
        width: wp(100),
        height: hp(120),
        backgroundColor: colors.artBoard,
        marginVertical: hp(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: hp(15)
    },
    rowStart: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    subdiv: {
        flex: 1,
        marginRight: hp(5),
    },
    quantitydiv: {
        width: wp(50),
        height: hp(60),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.artBoard,
        borderWidth: 0.3,
        borderColor: colors.lightGray,
        borderRadius: 10,
        marginHorizontal: hp(5),
        marginTop: hp(-10)
    },
    quantitydiv2: {
        width: wp(50),
        height: hp(60),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.artBoard,
        borderWidth: 0.3,
        borderColor: colors.lightGray,
        borderRadius: 10,
        marginHorizontal: hp(5),
        marginTop: hp(6)
    },
    price: {
        marginTop: hp(10)
    },
    bigDiv: {
        maxHeight: hp(400),
    },
    plus: {
        width: wp(20),
        height: hp(20),
        padding: hp(10),
        marginVertical: hp(10)
    },
    mins: {
        height: hp(8)
    },
    sheet: {
        backgroundColor: 'black'
    },
    columnContainer2: {
        marginTop: hp(20)
    },
    bigDiv2: {

    }

})