import React, {useContext, useState, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {NoProducts} from '../../../../constants/images';
import { Input } from '../../../../components/common/TextInput';
import {useFormik} from 'formik';
import {styles} from './styles';
import { colors } from '../../../../utils/themes';
import { CheckBox } from '../../../../components/common/CheckBox';
import DropDown from "react-native-paper-dropdown";
import { DropDownPicker } from '../../../../components/common/DropDown';
import { Select } from '../../../../components/common/SelectInput';
import { ProductFormData1 } from '../../../../utils/types';
import { ProductFormData1Schema } from '../../../../utils/constants';

import { getAllCategories, allCategories} from '../../../../redux/slices/StoreSlice';
import { resetImage } from '../../../../redux/slices/productSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';

import { createProduct, loading } from '../../../../redux/slices/productSlice';
import { myStore } from '../../../../redux/slices/StoreSlice';
import { Notify } from '../../../../utils/functions';

import { ProductCreateFormData } from '../../../../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AddProduct = (): JSX.Element => {
    const navigation = useNavigation<Nav>();
    const dispatch = useAppDispatch()
    const getList = useAppSelector(allCategories)

    const mystore = useAppSelector(myStore)
    const loader = useAppSelector(loading)
    
    const initialValues: ProductFormData1 = {
        name: '',
        description: '',
        category: '',
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
            DraftProduct(val)
            // navigation.navigate('PublishProduct', {data: val})
        },
    });

    const DraftProduct = async (data: {name: string, description: string, category: string, sizes: boolean, colours: boolean}) => {
        const payload: ProductCreateFormData = {
            id: mystore[0]._id,
            name: data?.name,
            description: data?.description,
            categories: data?.category,
            variants: [],
            isDraft: true,
            status: 'draft'
        }
        try {
            var resultAction = await dispatch(createProduct(payload))
            if(createProduct.fulfilled.match(resultAction)){
                Notify('Product Drafted!', 'Your product was successfully added to draft', 'success')
               await AsyncStorage.setItem('slug', resultAction?.payload?.message?.slug)
                navigation.navigate('PublishProduct', {data: data})
            }else{
                Notify('Product not Added!', 'Your product was not added to draft', 'error')
            }
        } catch (error) {
            Notify('Product not Added!', 'Your product was not added to draft', 'error')
            console.log(error)
        }
    }

    return (
        <SafeAreaView>
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
        </SafeAreaView>
    );
};