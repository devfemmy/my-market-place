

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayoutForm } from './PayoutForm';

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
    account_name: '',
    bank_account_number: '',
    bank_name: '',
  };

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue, isValid } =
  useFormik({
    initialValues,
    validationSchema: PayoutFormDataSchema,
    onSubmit: async (val: PayoutFormData) => {
      const id: string = await AsyncStorage.getItem('activeId')
      let form = val
      // const bankCode = banks.find((bank) => val.bank_name == bank.label)
      // form.bankCode = bankCode.code
      form._id = data.id
      delete form?.account
      await dispatch(updatePayout(form))
      await dispatch(getPayouts(id))
      modalizeRef.current?.close()
    },
  });

  const renderHeader = () => (
    <View style={styles.modal__header}>
        <Text style={[globalStyles.rowStart, globalStyles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Payout Account" />
    </View>
  );


  return (
    <>
      <View>
        <View>
            <ImageBackground source={PayoutBack} resizeMode="cover" style={[globalStyles.payoutCard]}>
                <Text fontWeight="500" fontSize={hp(17)} text={data?.account_name} />
                <Text style={[globalStyles.Verticalspacing]} fontWeight="500" fontSize={hp(14)} text={data?.bank_account_number + " - " + data?.bank_name} />
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
        <PayoutForm
          bankName={values.bank_name}
          accountName={values.account_name}
          accountNumber={values.bank_account_number}
          setField={setFieldValue}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
          isValid={isValid}
          loader={loader}
          handleSubmit={handleSubmit}
          btnTitle={'Update Account'}
        />
      </Modalize>
      </>
  );
};