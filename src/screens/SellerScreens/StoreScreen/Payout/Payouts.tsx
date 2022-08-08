/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/prop-types */
import React, {useRef, useState, useEffect} from 'react';
import {Text} from '../../../../components/common';
import {View, FlatList, TouchableOpacity, ImageBackground, SafeAreaView, ActivityIndicator, Image} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp, wp} from '../../../../utils/helpers';
import { colors } from '../../../../utils/themes';
import OrderCard from '../../../../components/resuable/OrderCard';
import { Input } from '../../../../components/common/TextInput';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { filterOrders, availableStatus, selected, searchOrders} from '../../../../redux/slices/orderSlice';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import {Modalize} from 'react-native-modalize';
import banks from '../../../../utils/banks';
import { useFormik } from 'formik';
import { PayoutFormData } from '../../../../utils/types';
import { PayoutFormDataSchema } from '../../../../utils/constants';
import { PayoutBack } from '../../../../constants/images';
import { Select } from '../../../../components/common/SelectInput';
import { Button } from '../../../../components/common/Button';
import { updatePayout, getPayouts, loading } from '../../../../redux/slices/StoreSlice';
import axios from 'axios';
import CONFIG from 'react-native-config';
import { bankVerification } from '../../../../utils/server';
import { string } from 'yup';
import { getPayoutBackground, productBackground } from '../../../../redux/slices/productSlice';
import { UniversityLogo } from '../../../../constants/images';
import { SearchDropdown } from '../../../../components/common/SearchDropdown';
import { useNavigation } from '@react-navigation/native';

export const Payouts = ({data}): JSX.Element => {
  const navigation = useNavigation()
  const modalizeRef = useRef(null);
  const dispatch = useAppDispatch()
  const loader = useAppSelector(loading)

  const [fetching, setFetching] = useState(false)
  const [accNum, setAccNum] = useState('')

  useEffect(() => {
    navigation.setOptions({ 
        headerRight: () => (
          <TouchableOpacity onPress={() => {setFieldValue('account', ''); modalizeRef.current?.open()}}>
            <Text
              fontWeight="400"
              fontSize={hp(14)}
              text={'Edit'}
              color={colors.bazaraTint}
              style={{marginRight: wp(15)}}
            />
          </TouchableOpacity>
        )
    })

  },[])


  const initialValues: PayoutFormData = {
    name: data.name,
    account: data.account,
    bankName: data.bankName,
  };

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue, isValid } =
  useFormik({
    initialValues,
    validationSchema: PayoutFormDataSchema,
    onSubmit: async (val: PayoutFormData) => {
      let form = val
      const bankCode = banks.find((bank) => val.bankName == bank.label)
      form.bankCode = bankCode.code
      form._id = data[0]._id
      await dispatch(updatePayout(form))
      modalizeRef.current?.close()
      await dispatch(getPayouts())
    },
  });
  
  const bankList = banks.map((val) => {return val.label})

  const renderHeader = () => (
    <View style={styles.modal__header}>
        <Text style={[globalStyles.rowStart, globalStyles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Payout Account" />
    </View>
  );

  const validateAccount = async (accountNumber: string, bankName: string) => {
    if(accountNumber.length == 10 && bankName){
      setFetching(true)
      const bankDetails = banks.find((bank) => bankName == bank.label)
      const bankCode = bankDetails?.code
      const payload = {
        bankAccount: accountNumber,
        bankCode: bankCode
      }
      try {
        const response = await bankVerification(payload)
        if (response.status === 200) {
          setFetching(false)
          console.log(response?.data)
          setFieldValue('name', response?.data?.data?.account_name)
        }else{
          setFetching(false)
          setFieldValue('name', '')
        }
      } catch (error) {
        console.log(error)
        setFetching(false)
        setFieldValue('name', '')
      }
    }else{
      setFieldValue('name', '')
    }
  }

  const colorChange = (color: string) => {
    if(values?.account?.length < 10){
      return 'transparent'
    }
    if(values?.name == ''){
      return colors.cancelled
    }
    else{
      return color
    }
  }

  const renderBody = () => (
    <>
        <SearchDropdown
            items={bankList}
            defaultValue={values.bankName}
            placeholder={'Bank'}
            setState={(value) => {setFieldValue('bankName', value); setFieldValue('name', ''); setFieldValue('account', '')}}
            errorMsg={touched.bankName ? errors.bankName : undefined}
        />
        <Input
            label={'Account Number'}
            value={values.account}
            onBlur={handleBlur('account')}
            onChangeText={(text) => {setFieldValue('account', text), validateAccount(text, values.bankName)}}
            errorMsg={touched.account ? errors.account : undefined}
        />
        {/* <Input
            label={'Account Name'}
            value={values.name}
            onBlur={handleBlur('name')}
            onChangeText={handleChange('name')}
            errorMsg={touched.name ? errors.name : undefined}
        /> */}
        <View style={[styles.namePreview, globalStyles.rowBetween, {backgroundColor: colorChange(colors.completed)}]}>
          {fetching ? <ActivityIndicator size={'small'}/> 
          : 
          <Text 
          color={values?.account?.length < 10 ? 'transparent' : colors.white} 
          fontWeight="400" fontSize={hp(13)} 
          text={values.name == '' ? 'Invalid Account' : values.name} />
          }

          <Ionicons name="checkmark-circle-outline" size={24} color={colorChange("#fff")} />
        </View>
        <Button style={{backgroundColor: !isValid ? colors.darkBlack : colors.bazaraTint}} disabled={!isValid} isLoading={loader} onPress={handleSubmit} title={'Update Account'}/>
    </>
);

  const renderItem = ({item}: any) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => {setFieldValue('account', ''); modalizeRef.current?.open()}}>
        <ImageBackground source={PayoutBack} resizeMode="cover" style={[globalStyles.payoutCard]}>
            <Text fontWeight="500" fontSize={hp(17)} text={item.name} />
            <Text style={[globalStyles.Verticalspacing]} fontWeight="500" fontSize={hp(14)} text={item.account + " - " + item.bankName} />
        </ImageBackground>
    </TouchableOpacity>
  );


  return (
    <>
      <View>
        {/* <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?._id}
            style={{marginBottom: hp(100)}}
        /> */}
        <View>
            <ImageBackground source={PayoutBack} resizeMode="cover" style={[globalStyles.payoutCard]}>
                <Text fontWeight="500" fontSize={hp(17)} text={data[0]?.name} />
                <Text style={[globalStyles.Verticalspacing]} fontWeight="500" fontSize={hp(14)} text={data[0]?.account + " - " + data[0]?.bankName} />
            </ImageBackground>
        </View>


        <View style={globalStyles.Verticalspacing} />
        <View style={[globalStyles.rowBetween, globalStyles.lowerContainer, globalStyles.Verticalspacing]}>
          <Text
            fontWeight="500"
            fontSize={hp(17)}
            text={'Transactions'}
          />
          <View style={[globalStyles.rowStart]}>
            <Entypo name='sound-mix' color={colors.white} size={hp(16)}/>
            <Text
              fontWeight="400"
              fontSize={hp(16)}
              text={' Filter'}
            />
          </View>
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <Image source={UniversityLogo} style={[globalStyles.selfCenterImage, globalStyles.Verticalspacing]} resizeMode="contain" />
        <Text style={[globalStyles.Verticalspacing]} fontWeight="500" fontSize={hp(20)} text="No Transactions at the moment" />
      </View>

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
      FooterComponent={<SafeAreaView/>}
      >
          {renderBody()}
          
      </Modalize>
      </>
  );
};
