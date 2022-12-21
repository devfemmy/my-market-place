import React, {useContext, useState, useEffect, useRef} from 'react';
import {Text, SafeAreaView} from '../../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../../utils/types';
import { Button } from '../../../../../components/common/Button';
import {View, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {globalStyles} from '../../../../../styles';
import {hp, wp} from '../../../../../utils/helpers';
import { Input } from '../../../../../components/common/TextInput';
import {styles} from './styles';
import { colors } from '../../../../../utils/themes';
import { MiniButton } from '../../../../../components/common/MiniButton';
import { ImageSelect } from './ImageSelect';
import { Modalize } from 'react-native-modalize';
import { Select } from '../../../../../components/common/SelectInput';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { addSize, newSizes, deleteSize, editSize, addColour, 
    newColours, editColour, deleteColour, images, resetImage, 
    addImage, createProduct, updateProduct, productBySlug, 
    getAllProducts, getProductBySlug, loading, addSizeColour, updateProductVariant,
    UpdateEditableSlug, editableSlug, createProductVariant, productVariants, createProductVariantSpec,
    getProductVariants, deleteProductVariantSpec, deleteProductVariant, activateProductVariant, deactivateProductVariant,
    activateProduct, deactivateProduct
 } from '../../../../../redux/slices/productSlice';
import { currencyFormat, Notify, firstLetterUppercase } from '../../../../../utils/functions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useRoute } from '@react-navigation/native';
import { userProfile } from '../../../../../redux/slices/userSilce';
import { ProductCreateFormData, ProductVariant } from '../../../../../utils/types';

import { myStore } from '../../../../../redux/slices/StoreSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SuccesssLogo } from '../../../../../constants/images';
import CustomSlideModal from '../../../../../components/common/CustomSlideModal';
import {useFormik} from 'formik';
import { VariantSpecRender } from './SpecRender';

export const PublishProduct = (): JSX.Element => {
    const navigation = useNavigation<Nav>();
    const route = useRoute();
    const data = route?.params?.data
    const [slug, setSlug] = useState('')
    
    const modalizeRef = useRef(null);
    const statusRef = useRef(null);
    const sizeList = ["", "S", "M", "L", "XL", "XXL", "XXXL"]

    const dispatch = useAppDispatch()
    const sizes = useAppSelector(newSizes)
    const items_by_colors = useAppSelector(newColours)
    const item_images = useAppSelector(images)

    const loader = useAppSelector(loading)

    const variants = useAppSelector(productVariants)

    const product_slug = useAppSelector(productBySlug)

    const user = useAppSelector(userProfile)[0]
    const mystore = useAppSelector(myStore)


    const [edit, setEdit] = useState(false)
    const [editable, setEditable] = useState(0)

    const [editData, setEditData] = useState(route?.params?.editData)

    const [adding, setAdding] = useState(false)

    const [selectedSize, setSelectedSize] = useState('')
    const [colorDescription, setColorDescription] = useState('')
    const [selectedPrice, setSelectedPrice] = useState('0')
    const [selectedQuantity, setSelectedQuantity] = useState('1')

    const [successModal, setSuccessModal] = useState(false)

    const initialValues: ProductVariant = {
        size: "0",
        quantity: "0",
        color: "",
        amount: "0",
        img_urls: item_images,
        product_id: "",
        product_variant_id: ""
    };

    const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } =
    useFormik({
        initialValues,
        onSubmit: async (val: ProductVariant) => {
            const processedImages = item_images.filter((val: string) => {
                if(val != null && val != ''){
                    return val
                }
            })
            if(processedImages.length < 1){
                Notify('Error!', 'Please add an image', 'error')
                return
            }
            val.product_id = product_slug?.id
            val.img_urls = processedImages
            val.amount = Number(val.amount)
            val.size = Number(val.size)
            val.quantity = Number(val.quantity)

            const payload = {
                img_urls: processedImages,
                product_id: product_slug?.id,
                color: val.color,
                size: val.size,
                quantity: Number(val.quantity),
                amount: Number(val.amount)
            }

            if(!data?.colours && !data.sizes){
                await NColorNSize(payload)
            }
            else if(data?.colours && !data.sizes){
                await ColorNSize(payload)
            }
            else if(!data?.colours && data.sizes) {
                await NColorSize(payload)
            }else{
                await ColorSize(payload)
            }
            // await dispatch(createProductVariant(payload))
            await dispatch(getProductVariants(product_slug?.id))
            setFieldValue('color', "")
        },
    });

    // console.log(variants[0]?.product_variant_specs)
    // console.log(product_slug)

    useEffect(() => {
        loadData()
    }, [slug])

    const renderHeader = () => (
        <View style={styles.modal__header}>
            <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Size Details" />
        </View>
    );

    const renderSizeBody = () => (
        <>
        <Select
            items={sizeList}
            setState={item => setFieldValue('size', item)}
            defaultValue={values.size}
            placeholder={'Size'}
        />
        {/* <Input
            label={'Size *'}
            value={values.size}
            onChangeText={handleChange('size')}
            keyboardType={"number-pad"}
        /> */}
        <Input
            label={'Price *'}
            value={values.amount}
            onChangeText={handleChange('amount')}
            keyboardType={"number-pad"}
        />
        <View style={{alignSelf: 'center', justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start"}}>
            <View>
                <Input
                    label={'Quantity'}
                    value={values.quantity}
                    style={{height: wp(52), width: wp(220), marginLeft: hp(-10)}}
                    onChangeText={handleChange('quantity')}
                    keyboardType={"number-pad"}
                />
            </View>
            <MiniButton onPress={() => updateQuantity('minus')} style={{marginLeft: hp(15)}} icon={'minus'}/>
            <MiniButton onPress={() => updateQuantity('plus')} icon={'plus'}/>
        </View>
        <Button isLoading={adding} disabled={adding} onPress={() => CreateVariantSpec(false)} title={'Save and add new'}/>
        <View style={[globalStyles.rowCenter, globalStyles.cardSeparator, globalStyles.noSeparator, globalStyles.Verticalspacing]}>
            <TouchableOpacity disabled={adding} onPress={() => CreateVariantSpec(true)}>
                <Text text={"Save and close"} color={colors.white} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)}/>
            </TouchableOpacity>
        </View>
        </>
    );

    const renderVariantList = ({index, item}: {item: any, index: number}) => {
        return (
            <View>
                <View style={[globalStyles.rowBetween, {paddingHorizontal: hp(15), paddingVertical: hp(15)}]}>
                    <View style={[globalStyles.rowStart]}>
                        <View style={[globalStyles.rowStartNoOverflow]}>
                            <Image source={{uri: item?.img_urls[0]}} style={styles.image} />
                        </View>
                        <View style={styles.detContainer}>
                            <Text text={firstLetterUppercase(item?.color)} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                        </View>
                    </View>

                    <View style={[globalStyles.rowStart]}>
                        { data?.sizes ?
                            <TouchableOpacity onPress={() => HandleVariantEdit(item)} style={globalStyles.mini_button}>
                                <MaterialIcons name={'add'} size={hp(15)} style={{color: colors.white}} />
                            </TouchableOpacity>
                            :
                            null
                        }
                        <TouchableOpacity onPress={() => UpdateVariantStatus(item?.id, item?.status)} style={globalStyles.mini_button}>
                            <MaterialIcons 
                            name={item?.status?.toLowerCase() === 'active' ? 'check-circle' : 'radio-button-unchecked'} 
                            size={hp(15)} 
                            style={{color: colors.white}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteVariant(item?.id)} style={globalStyles.mini_button}>
                            <FontAwesome name={'trash-o'} size={hp(16)} style={{color: colors.white}} />
                        </TouchableOpacity>
                    </View>
                </View>
                <VariantSpecRender slugId={product_slug?.id} variantId={item?.id} loading={loader} />
            </View>
        )
    }

    const renderColourAndSizePage = () => {
        return (
            <>
                <View style={[globalStyles.rowAround, {marginHorizontal: hp(10)}]}>
                    <View>
                        <Input
                            label={'Color *'}
                            value={values.color}
                            onChangeText={handleChange('color')}
                            style={{width: wp(335)}}
                            containerStyle={{width: wp(335)}}
                        />
                    </View>
                </View>
                <Button isLoading={loader} title={"Add Variant"} onPress={handleSubmit} style={styles.btn}/>
                <FlatList
                    data={variants}
                    renderItem={renderVariantList}
                    scrollEnabled={false}
                />
            </>
        )
    }

    const renderNoColourAndNoSizePage = () => {
        return (
            <>
                <View style={[globalStyles.rowAround, {marginHorizontal: hp(0)}]}>
                    <View>
                    <Input
                        label={'Price *'}
                        value={values.amount}
                        onChangeText={handleChange('amount')}
                        style={{width: wp(335)}}
                        containerStyle={{width: wp(335)}}
                    />
                    <View style={{alignSelf: 'center', justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start"}}>
                        <View>
                            <Input
                                label={'Quantity'}
                                value={values.quantity}
                                style={{height: wp(52), width: wp(215), marginLeft: hp(-10)}}
                                onChangeText={handleChange('quantity')}
                                keyboardType={"number-pad"}
                            />
                        </View>
                        <MiniButton onPress={() => updateQuantity('minus')} style={{marginLeft: hp(15)}} icon={'minus'}/>
                        <MiniButton onPress={() => updateQuantity('plus')} icon={'plus'}/>
                    </View>
                    </View>
                </View>
                <Button isLoading={loader} title={"Add Variant"} onPress={handleSubmit} style={styles.btn}/>
                <FlatList
                    data={variants}
                    renderItem={renderVariantList}
                    scrollEnabled={false}
                />
            </>
        )
    }

    const renderColourAndNoSizePage = () => {
        return (
            <>
                <View style={[globalStyles.rowAround, {marginHorizontal: hp(0)}]}>
                    <View>
                    <Input
                        label={'Color *'}
                        value={values.color}
                        onChangeText={handleChange('color')}
                        style={{width: wp(335)}}
                        containerStyle={{width: wp(335)}}
                    />
                    <Input
                        label={'Price *'}
                        value={values.amount}
                        onChangeText={handleChange('amount')}
                        style={{width: wp(335)}}
                        containerStyle={{width: wp(335)}}
                    />
                    <View style={{alignSelf: 'center', justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start"}}>
                        <View>
                            <Input
                                label={'Quantity'}
                                value={values.quantity}
                                style={{height: wp(52), width: wp(215), marginLeft: hp(-10)}}
                                onChangeText={handleChange('quantity')}
                                keyboardType={"number-pad"}
                            />
                        </View>
                        <MiniButton onPress={() => updateQuantity('minus')} style={{marginLeft: hp(15)}} icon={'minus'}/>
                        <MiniButton onPress={() => updateQuantity('plus')} icon={'plus'}/>
                    </View>
                    </View>
                </View>
                <Button isLoading={loader} title={"Add Variant"} onPress={handleSubmit} style={styles.btn}/>
                <FlatList
                    data={variants}
                    renderItem={renderVariantList}
                    scrollEnabled={false}
                />
            </>
        )
    }

    const renderNoColourAndSizePage = () => {
        return (
            <>
                <Button isLoading={loader} title={"Add Variant"} onPress={handleSubmit} style={styles.btn}/>
                <FlatList
                    data={variants}
                    renderItem={renderVariantList}
                    scrollEnabled={false}
                />
            </>
        )
    }


    // SUBBMISSIONS

    const NColorNSize = async (payload: any) => {
        if(payload?.amount < 500){
            Notify('Error!', 'Price cannot be less than 500', 'error')
            return
        }
        if(payload?.quantity < 1){
            Notify('Error!', 'Quantity cannot be less than 1', 'error')
            return
        }
        const createVariantData: any = {
            img_urls: payload?.img_urls,
            product_id: payload?.product_id
        }
        
        await dispatch(createProductVariant(createVariantData)).then(async (val) => {
            const createSpecData: any = {
                amount: payload?.amount,
                quantity: payload?.quantity,
                product_variant_id: val?.payload?.id
            }
            await dispatch(resetImage())
            await dispatch(createProductVariantSpec(createSpecData))
        })
    }

    const ColorNSize = async (payload: any) => {
        if(payload?.amount < 500){
            Notify('Error!', 'Price cannot be less than 500', 'error')
            return
        }
        if(payload?.quantity < 1){
            Notify('Error!', 'Quantity cannot be less than 1', 'error')
            return
        }
        if(payload?.color == "" || payload?.color == null){
            Notify('Error!', 'Enter valid value for color', 'error')
            return
        }

        const createVariantData: any = {
            img_urls: payload?.img_urls,
            product_id: payload?.product_id,
            color: payload?.color
        }
        
        await dispatch(createProductVariant(createVariantData)).then(async (val) => {
            const createSpecData: any = {
                amount: payload?.amount,
                quantity: payload?.quantity,
                product_variant_id: val?.payload?.id
            }
            await dispatch(resetImage())
            await dispatch(createProductVariantSpec(createSpecData))
        })
    }

    const NColorSize = async (payload: any) => {
        const createVariantData: any = {
            img_urls: payload?.img_urls,
            product_id: payload?.product_id
        }
        
        await dispatch(createProductVariant(createVariantData)).then(async (val) => {
            await dispatch(resetImage())
            HandleVariantEdit(val?.payload)
        })
    }

    const ColorSize = async (payload: any) => {
        const createVariantData: any = {
            img_urls: payload?.img_urls,
            product_id: payload?.product_id,
            color: payload?.color
        }
        await dispatch(createProductVariant(createVariantData)).then(async (val) => {
            await dispatch(resetImage())
            HandleVariantEdit(val?.payload)
        })
    }



    // FUNCTIONS

    const updateQuantity = (val: string) => {
        if(val == 'minus' && Number(selectedQuantity) < 1) {
            return
        }

        if(val == 'minus' && values.quantity < 1){
            return
        }

        if(val == 'plus'){
            setFieldValue('quantity', (Number(values.quantity) + 1).toString())
            setSelectedQuantity((Number(selectedQuantity) + 1).toString())
        }else{
            setFieldValue('quantity', (Number(values.quantity) - 1).toString())
            setSelectedQuantity((Number(selectedQuantity) - 1).toString())
        }
    }

    const loadData = async () => {
        const dataslug: any = await AsyncStorage.getItem('slug')
        setSlug(dataslug)
        await dispatch(getProductBySlug(dataslug)).then(async (resp) => {
            await dispatch(getProductVariants(resp?.payload?.id))
        })
    }

    const BtnTitle = () => {
        if(product_slug?.status?.toLowerCase() == 'inactive'){
            return 'Activate Product'
        }
        else{
            return 'Deactivate Product'
        }

    }

    const HandleVariantEdit = async (item: any) => {
        console.log(item)
        setFieldValue('color', item?.color)
        setFieldValue('img_urls', item?.img_urls)
        setFieldValue('product_variant_id', item?.id)
        setTimeout(() => {modalizeRef.current?.open()}, 200)
    }

    const CreateVariantSpec = async (close: boolean) => {
        setAdding(true)
        const payload = {
            size: values.size,
            quantity: Number(values.quantity),
            amount: Number(values.amount),
            product_variant_id: values.product_variant_id
        }
        await dispatch(createProductVariantSpec(payload))
        await dispatch(getProductVariants(product_slug?.id))

        setFieldValue('size', "")
        setFieldValue('amount', "")
        setFieldValue('quantity', "")

        if(close){
            modalizeRef.current?.close()
        }
        setAdding(false)
    }

    const deleteVariant = async (id: string) => {
        await dispatch(deleteProductVariant(id))
        await dispatch(getProductVariants(product_slug?.id))
    }

    const deleteVariantSpec = async (id: string) => {
        await dispatch(deleteProductVariantSpec(id))
        await dispatch(getProductVariants(product_slug?.id))
    }

    const UpdateVariantStatus = async (id: string, status: string) => {
        console.log(status?.toLowerCase())
        if(status?.toLowerCase() === 'inactive'){
            await dispatch(activateProductVariant(id))
        }else{
            await dispatch(deactivateProductVariant(id))
        }
        await dispatch(getProductVariants(product_slug?.id))
    }

    const UpdateProductStatus = async () => {
        if(product_slug?.status?.toLowerCase() === 'inactive'){
            console.log(product_slug?.id)
            await dispatch(activateProduct(product_slug?.id))
        }else{
            await dispatch(deactivateProduct(product_slug?.id))
        }

        const data = await AsyncStorage.getItem('slug')
        dispatch(getProductBySlug(data))
    }

    return (
        <>
        <ScrollView style={[globalStyles.wrapper, {paddingTop: hp(20)}]}>
            <Text style={[styles.lowerContainer]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(16)} text="Upload images" />
            <ImageSelect/>
            { !data?.colours && !data.sizes ? renderNoColourAndNoSizePage() : null}
            { data?.colours && !data.sizes ? renderColourAndNoSizePage() : null }
            { !data?.colours && data.sizes ? renderNoColourAndSizePage() : null }
            { data?.colours && data.sizes ? renderColourAndSizePage() : null}
            <View style={{marginBottom: hp(200)}}/>
        </ScrollView>
        {/* <View style={{position: 'absolute', bottom: hp(30), width: '100%'}}>
            <Button isLoading={loader} title={BtnTitle()} onPress={() => UpdateProductStatus()} style={styles.btn}/>
        </View> */}
        <Modalize
        modalStyle={{backgroundColor: colors.primaryBg}}
        keyboardAvoidingOffset={100}
        adjustToContentHeight
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
        ref={modalizeRef}
        overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
        handlePosition={'inside'}
        handleStyle={{backgroundColor: colors.darkGrey}}
        HeaderComponent={renderHeader}
        >
            {renderSizeBody()}
        </Modalize>
        <CustomSlideModal 
        onButtonPress={() => navigation.popToTop()} 
        msg={'You have successfully updated your product!'} 
        headerText={'Success'} 
        visibleBoolean={successModal}/>
        </>
    );
};