import React, {useContext, useState, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../../utils/types';
import { AuthContext } from '../../../../../context/context';
import { Button } from '../../../../../components/common/Button';
import {View, Image, FlatList, TouchableOpacity, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {globalStyles} from '../../../../../styles';
import {hp,wp} from '../../../../../utils/helpers';
import {NoProducts} from '../../../../../constants/images';
import { Input } from '../../../../../components/common/TextInput';
import {useFormik} from 'formik';
import {styles} from './styles';
import { colors } from '../../../../../utils/themes';
import { CheckBox } from '../../../../../components/common/CheckBox';
import DropDown from "react-native-paper-dropdown";
import { DropDownPicker } from '../../../../../components/common/DropDown';
import { Select } from '../../../../../components/common/SelectInput';
import { ProductFormData1 } from '../../../../../utils/types';
import { ProductFormData1Schema } from '../../../../../utils/constants';

import { getAllCategories, allCategories} from '../../../../../redux/slices/StoreSlice';
import { resetImage } from '../../../../../redux/slices/productSlice';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';

import { createProduct, loading, productBySlug, newColours, deleteColour, updateProduct, getAllProducts, newSizeColours, deleteSizeColour, editableSlug, categories } from '../../../../../redux/slices/productSlice';
import { myStore } from '../../../../../redux/slices/StoreSlice';
import { Notify, firstLetterUppercase } from '../../../../../utils/functions';

import { MiniButton } from '../../../../../components/common/MiniButton';

import { ProductCreateFormData } from '../../../../../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { currencyFormat } from '../../../../../utils/functions';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import CustomSlideModal from '../../../../../components/common/CustomSlideModal';

export const AddProduct = (): JSX.Element => {
    const navigation = useNavigation<Nav>();
    const dispatch = useAppDispatch()
    const getList = useAppSelector(allCategories)

    const mystore = useAppSelector(myStore)
    const loader = useAppSelector(loading)
    const availableCategories = useAppSelector(categories)
    const EditableSlug = useAppSelector(editableSlug)
    const product_slug = useAppSelector(productBySlug)
    const items_by_colors = useAppSelector(newColours)
    const items_by_size_colors = useAppSelector(newSizeColours)

    const [successModal, setSuccessModal] = useState(false)

    const initialValues: ProductFormData1 = {
        name: EditableSlug != null ? EditableSlug.name : '',
        description: EditableSlug != null ? EditableSlug.description : '',
        category: EditableSlug != null ? EditableSlug.categories : '',
        sizes: false,
        colours: false,
    };

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    

    const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } =
    useFormik({
        initialValues,
        validationSchema: ProductFormData1Schema,
        onSubmit: (val: ProductFormData1) => {
            dispatch(resetImage())
            if(EditableSlug?.name != null){
                UpdateSlugProduct(val)
            }else{
                DraftProduct(val)
            }
            // navigation.navigate('PublishProduct', {data: val})
        },
    });

    const DraftProduct = async (data: {name: string, description: string, category: string, sizes: boolean, colours: boolean}) => {

        const selectedCategory = await availableCategories?.filter((val: any) => {
            if(val?.category == data?.category){
                return val
            }
        })

        const payload: ProductCreateFormData = {
            id: mystore[0].id,
            name: data?.name,
            description: data?.description,
            categories: selectedCategory[0]?.id,
            variants: [],
            isDraft: true,
            status: 'draft'
        }
        try {
            var resultAction = await dispatch(createProduct(payload))
            if(createProduct.fulfilled.match(resultAction)){
                console.log(resultAction?.payload)
                Notify('Product Drafted!', 'Your product was successfully added to draft', 'success')
                await AsyncStorage.setItem('slug', resultAction?.payload?.slug)
                navigation.navigate('PublishProduct', {data: data})
            }else{
                Notify('Product not Added!', 'Your product was not added to draft', 'error')
            }
        } catch (error) {
            Notify('Product not Added!', 'Your product was not added to draft', 'error')
            console.log(error)
        }
    }

    const UpdateSlugProduct = async (data: {name: string, description: string, category: string, sizes: boolean, colours: boolean}) => {
        console.log(EditableSlug?.slug)
        await AsyncStorage.setItem('slug', EditableSlug?.slug)
        navigation.navigate('PublishProduct', {data: data})
    }

    const handleColorAloneSubmit = async (
        draft: boolean,
        colors: Array<any>,
        id: string,
        data: {name: string, description: string, category: string}
        ) => {

        const colorVariants = colors.map((val: {colour: string, price: number, quantity: number, images: Array<string>}) => {
            return {
                spec: [{colour: val.colour, price: val.price, quantity: val.quantity}],
                variantImg: val.images
            }
        })
    
        const payload: ProductCreateFormData = {
            id: product_slug._id,
            name: data?.name,
            description: data?.description,
            categories: data?.category,
            variants: colorVariants,
            isDraft: draft,
            status: 'active'
        }
        try {
            var resultAction = await dispatch(updateProduct(payload))
            if(updateProduct.fulfilled.match(resultAction) && resultAction?.payload){
                setSuccessModal(true)
                await dispatch(getAllProducts(id))
            }else{
                Notify('Product not Added!', 'Your product was not added', 'error')
            }
        } catch (error) {
            Notify('Product not Added!', 'Your product was not added', 'error')
            console.log(error)
        }
    }

    const handleColorSizeSubmit = async (
        draft: boolean,
        colors: Array<any>,
        id: string,
        data: {name: string, description: string, category: string}
        ) => {
        
        const Variants = colors.map((val: {colour: string, size: Array<any>, images: Array<string>}) => {
            const variant = val.size.map((vak: {price: Number, quantity: Number, size: string}) => {
                return {
                    price: vak.price,
                    quantity: vak.quantity,
                    size: vak.size,
                    colour: val.colour
                }
            })
            return {
                spec: variant,
                variantImg: val.images
            }
        })

        const payload: ProductCreateFormData = {
            id: product_slug._id,
            name: data?.name,
            description: data?.description,
            categories: data?.category,
            variants: Variants,
            isDraft: draft,
            status: 'active'
        }
        try {
            var resultAction = await dispatch(updateProduct(payload))
            if(updateProduct.fulfilled.match(resultAction) && resultAction?.payload){
                setSuccessModal(true)
                await dispatch(getAllProducts(id))
            }else{
                Notify('Product not Added!', 'Your product was not added', 'error')
            }
        } catch (error) {
            Notify('Product not Added!', 'Your product was not added', 'error')
            console.log(error)
        }
    }

    const renderFooter = () => {
        return (
        <>
            <Text style={[globalStyles.rowStart, styles.lowerContainer]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(15)} text="Size and Colour Options" />
            
            <CheckBox
                label={'Does your product have sizes?'}
                status={values?.sizes ? 'checked' : 'unchecked'}
                handleChange={() => setFieldValue('sizes', !values.sizes)}
            />

            <CheckBox
                label={'Does your product have colours?'}
                status={values?.colours ? 'checked' : 'unchecked'}
                handleChange={() => setFieldValue('colours', !values.colours)}
            />
            
            <View style={[globalStyles.rowCenter, globalStyles.footer]}>
                <Button isLoading={loader} title={'Continue'} style={styles.btn} onPress={handleSubmit} />
            </View>
        </>
        )
    }

    const renderColorList = ({index, item}) => {
        return(
                <View style={[globalStyles.rowBetween, globalStyles.minicardSeparator, {paddingHorizontal: hp(15), paddingVertical: hp(15)}]}>
                    <View style={[globalStyles.rowStart]}>
                        <View style={[globalStyles.rowStartNoOverflow]}>
                            <Image source={{uri: item?.images[0]}} style={styles.image} />
                        </View>
                        <View style={styles.detContainer}>
                            <Text text={firstLetterUppercase(item?.colour)} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                            <View style={globalStyles.rowStart}>
                                <Text
                                text={"Price: "}
                                fontWeight={"300"}
                                fontSize={hp(12)}
                                style={styles.text} />
                                <Text
                                // text={currencyFormat(item?.price)}
                                text={item?.price}
                                fontWeight={"300"}
                                fontSize={hp(12)}
                                color={colors.bazaraTint}
                                style={styles.text} />
                            </View>
                        </View>
                    </View>

                    <View style={[globalStyles.rowStart]}>
                        {/* <TouchableOpacity onPress={() => editPrevColor(index, item)} style={globalStyles.mini_button}>
                            <MaterialIcons name={'edit'} size={hp(15)} style={{color: colors.white}} />
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => dispatch(deleteColour(index))} style={globalStyles.mini_button}>
                            <FontAwesome name={'trash-o'} size={hp(16)} style={{color: colors.white}} />
                        </TouchableOpacity>
                    </View>
                </View>
        )
    }

    const renderSizeColorList = ({index, item}) => {
        return(
                <View style={[globalStyles.rowBetween, globalStyles.minicardSeparator, {paddingHorizontal: hp(15), paddingVertical: hp(15)}]}>
                    <View style={[globalStyles.rowStart]}>
                        <View style={[globalStyles.rowStartNoOverflow]}>
                            <Image source={{uri: item?.images[0]}} style={styles.image} />
                        </View>
                        <View style={styles.detContainer}>
                            <Text text={firstLetterUppercase(item?.colour)} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                            <View style={globalStyles.rowStart}>
                                <Text
                                text={"Price: "}
                                fontWeight={"300"}
                                fontSize={hp(12)}
                                style={styles.text} />
                                <Text
                                // text={currencyFormat(item?.price)}
                                text={item?.size[0]?.price}
                                fontWeight={"300"}
                                fontSize={hp(12)}
                                color={colors.bazaraTint}
                                style={styles.text} />
                            </View>
                        </View>
                    </View>

                    <View style={[globalStyles.rowStart]}>
                        {/* <TouchableOpacity onPress={() => editPrevColor(index, item)} style={globalStyles.mini_button}>
                            <MaterialIcons name={'edit'} size={hp(15)} style={{color: colors.white}} />
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => dispatch(deleteSizeColour(index))} style={globalStyles.mini_button}>
                            <FontAwesome name={'trash-o'} size={hp(16)} style={{color: colors.white}} />
                        </TouchableOpacity>
                    </View>
                </View>
        )
    }

    const processArray = () => {
        const colorVariants = items_by_colors.map((val: {colour: string, price: number, quantity: number, images: Array<string>}) => {
            return {
                spec: [{colour: val.colour, price: val.price, quantity: val.quantity}],
                variantImg: val.images
            }
        })

        console.log(colorVariants)
    }

    const renderColourFooter = () => {
        return (
            <>
                <View style={globalStyles.list_header}>
                    <View style={[globalStyles.rowBetween, globalStyles.lowerContainer, globalStyles.list_header_content]}>
                        <Text fontWeight="500" fontSize={hp(14)} text={'Product Colours'} />
                    </View>
                </View>
                <FlatList
                    data={items_by_colors}
                    renderItem={renderColorList}
                    scrollEnabled={true}
                    ListFooterComponent={ () =>
                        (
                            <View style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]}>
                                <MiniButton 
                                iconSize={hp(15)}
                                onPress={() => navigation.navigate('PublishProduct', {data: values})}
                                iconColor={colors.primaryBg} style={globalStyles.littleButton} 
                                icon={'plus'}/>
                                
                                <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Horizontalspacing]} fontWeight="400"
                                color={colors.white}
                                textAlign='left'
                                fontSize={hp(16)}
                                text={"Add Another Colour"} />
                            </View>
                        )
                    }
                />
                <View style={[globalStyles.rowCenter, {marginBottom: hp(10)}]}>
                    <Button 
                    isLoading={loader} 
                    title={'Publish'} 
                    onPress={() => handleColorAloneSubmit(false, items_by_colors, mystore[0]._id, values)} 
                    style={styles.btn}/>
                </View>
            </>
        )
    }

    const renderSizeColourFooter = () => {
        return (
            <>
                <View style={globalStyles.list_header}>
                    <View style={[globalStyles.rowBetween, globalStyles.lowerContainer, globalStyles.list_header_content]}>
                        <Text fontWeight="500" fontSize={hp(14)} text={'Product Colours'} />
                    </View>
                </View>
                <FlatList
                    data={items_by_size_colors}
                    renderItem={renderSizeColorList}
                    scrollEnabled={true}
                    ListFooterComponent={ () =>
                        (
                            <View style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]}>
                                <MiniButton 
                                iconSize={hp(15)}
                                onPress={() => navigation.navigate('PublishProduct', {data: values})}
                                iconColor={colors.primaryBg} style={globalStyles.littleButton} 
                                icon={'plus'}/>
                                
                                <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Horizontalspacing]} fontWeight="400"
                                color={colors.white}
                                textAlign='left'
                                fontSize={hp(16)}
                                text={"Add Another Colour"} />
                            </View>
                        )
                    }
                />
                <View style={[globalStyles.rowCenter, {marginBottom: hp(10)}]}>
                    <Button 
                    isLoading={loader} 
                    title={'Publish'} 
                    onPress={() => handleColorSizeSubmit(false, items_by_size_colors, mystore[0]._id, values)} 
                    style={styles.btn}/>
                </View>
            </>
        )
    }

    const renderSpecList = ({index, item}) => {
        return (
            <View style={[globalStyles.rowStart, {marginVertical: hp(3)}]}>
                <Text
                text={(item?.size || 'Colour') + ' - ' + currencyFormat(item?.price) + ' - x' + item?.quantity}
                fontWeight={"300"}
                fontSize={hp(12)}
                style={styles.text} />
            </View>
        )
    }

    const renderEditableSlugVariant = ({index, item}) => {
        return (
            <View style={[globalStyles.rowBetween, globalStyles.minicardSeparator, {paddingHorizontal: hp(15), paddingVertical: hp(15)}]}>
                <View style={[globalStyles.rowStart]}>
                    <View style={[globalStyles.rowStartNoOverflow]}>
                        <Image source={{uri: item?.variantImg[0]}} style={styles.image} />
                    </View>
                    <View style={styles.detContainer}>
                        <FlatList
                            data={item?.spec}
                            renderItem={renderSpecList}
                            keyExtractor={item => item?._id}
                        />
                    </View>
                </View>

                <View style={[globalStyles.rowStart]}>
                    {/* <TouchableOpacity onPress={() => {dispatch(resetImage()); navigation.navigate('PublishProduct', {editData: item, data: values})}} style={globalStyles.mini_button}>
                        <MaterialIcons name={'edit'} size={hp(15)} style={{color: colors.white}} />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={globalStyles.mini_button}>
                        <FontAwesome name={'trash-o'} size={hp(16)} style={{color: colors.white}} />
                    </TouchableOpacity> */}
                </View>
                
            </View>
        )
    }
 
    const renderEditableSlug = () => {
        return (
            <>
                <CheckBox
                label={'Does your product have sizes?'}
                status={values?.sizes ? 'checked' : 'unchecked'}
                handleChange={() => setFieldValue('sizes', !values.sizes)}
                />

                <CheckBox
                    label={'Does your product have colours?'}
                    status={values?.colours ? 'checked' : 'unchecked'}
                    handleChange={() => setFieldValue('colours', !values.colours)}
                />
                {/* <FlatList
                    data={EditableSlug.variants}
                    renderItem={renderEditableSlugVariant}
                    scrollEnabled={true}
                /> */}
                <View style={[globalStyles.rowCenter, {marginBottom: hp(10)}]}>
                    <Button 
                    isLoading={loader} 
                    title={'Update'} 
                    onPress={handleSubmit}
                    style={styles.btn}/>
                </View>
            </>
        )
    }

    return (
        <SafeAreaView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex: 1}}>
            <Text style={[globalStyles.rowStart, styles.lowerContainer]} fontWeight="400" color={colors.darkGrey} textAlign='left' fontSize={hp(15)} text="Kindly provide product information" />
            <Input
                label={'Product Name *'}
                value={values.name}
                onBlur={handleBlur('name')}
                onChangeText={handleChange('name')}
                errorMsg={touched.name ? errors.name : undefined}
            />

            <Input
                label={'Tell us about your product'}
                value={values.description}
                onBlur={handleBlur('description')}
                onChangeText={handleChange('description')}
                multiline={true}
                errorMsg={touched.description ? errors.description : undefined}
            />

            <Select
                items={getList}
                defaultValue={values.category}
                placeholder={'Category'}
                setState={handleChange('category')}
                errorMsg={touched.category ? errors.category : undefined}
            />
            {EditableSlug != null && items_by_size_colors.length < 1 && items_by_colors.length < 1 ? renderEditableSlug() : (items_by_size_colors.length > 0 ? (renderSizeColourFooter()) : (items_by_colors.length > 0 ? renderColourFooter() : renderFooter()))}

            <CustomSlideModal 
            onButtonPress={() => navigation.popToTop()} 
            msg={'You have successfully updated your product!'} 
            headerText={'Success'} 
            visibleBoolean={successModal}/>
            </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};