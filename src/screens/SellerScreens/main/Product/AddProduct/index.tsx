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
        category: EditableSlug != null ? EditableSlug?.category_id : '',
        sizes: false,
        colours: false,
    };

    useEffect(() => {
        dispatch(getAllCategories())
        if(EditableSlug != null){
            getCategoryName(EditableSlug?.category_id)
        }
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

    const getCategoryName = async (categoryId: string) => {
        const selectedCategory = await availableCategories?.filter((val: any) => {
            if(val?.id == categoryId){
                return val
            }
        }) 
        setFieldValue('category', selectedCategory[0]?.category)
        return selectedCategory[0]?.category
    }

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
                const id: any = await AsyncStorage.getItem('activeId')
                await dispatch(getAllProducts(id))
                Notify('Product Drafted!', 'Your product was successfully added to draft', 'success')
                await AsyncStorage.setItem('slug', resultAction?.payload?.slug)
                navigation.navigate('PublishProduct', {data: data})
            } else{
                Notify('Product not Added!', 'Your product was not added to draft', 'error')
            }
        } catch (error) {
            Notify('Product not Added!', 'Your product was not added to draft', 'error')
            console.log(error)
        }
    }

    const UpdateSlugProduct = async (data: {name: string, description: string, category: string, sizes: boolean, colours: boolean}) => {
        const selectedCategory = await availableCategories?.filter((val: any) => {
            if(val?.category == data?.category){
                return val
            }
        })

        const payload = {
            id: EditableSlug?.id,
            name: values?.name,
            description: values?.description,
            category_id: selectedCategory[0]?.id
        }

        try {
            var resultAction = await dispatch(updateProduct(payload))
            if(updateProduct.fulfilled.match(resultAction)){
                const id: any = await AsyncStorage.getItem('activeId')
                await dispatch(getAllProducts(id))
                await AsyncStorage.setItem('slug', EditableSlug?.slug)
                navigation.navigate('PublishProduct', {data: data})
            } else {
                Notify('Product not Updated!', 'Your product was not updated', 'error')
            }
        } catch (error) {
            Notify('Product not Updated!', 'Your product was not updated', 'error')
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

    const processArray = () => {
        const colorVariants = items_by_colors.map((val: {colour: string, price: number, quantity: number, images: Array<string>}) => {
            return {
                spec: [{colour: val.colour, price: val.price, quantity: val.quantity}],
                variantImg: val.images
            }
        })

        console.log(colorVariants)
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