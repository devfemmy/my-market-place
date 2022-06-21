/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/prop-types */
import React, {useRef} from 'react';
import {Text} from '../../../components/common';
import {View, FlatList, TouchableOpacity, ImageBackground, SafeAreaView} from 'react-native';
import {globalStyles} from '../../../styles';
import {hp} from '../../../utils/helpers';
import { colors } from '../../../utils/themes';
import OrderCard from '../../../components/resuable/OrderCard';
import { Input } from '../../../components/common/TextInput';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { filterOrders, availableStatus, selected, searchOrders} from '../../../redux/slices/orderSlice';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Modalize} from 'react-native-modalize';
import banks from '../../../utils/banks';
import { useFormik } from 'formik';
import { PayoutFormData } from '../../../utils/types';
import { PayoutFormDataSchema } from '../../../utils/constants';
import { PayoutBack } from '../../../constants/images';
import { Select } from '../../../components/common/SelectInput';
import { Button } from '../../../components/common/Button';
import { updatePayout, getPayouts, loading } from '../../../redux/slices/StoreSlice';
export const Payouts = ({data}): JSX.Element => {
  const modalizeRef = useRef(null);
  const dispatch = useAppDispatch()
  const loader = useAppSelector(loading)

  const initialValues: PayoutFormData = {
    name: data.name,
    account: data.account,
    bankName: data.bankName,
  };
  

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } =
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

  const renderBody = () => (
    <>
        <Select
            items={bankList}
            defaultValue={values.bankName}
            placeholder={'Bank'}
            setState={handleChange('bankName')}
            errorMsg={touched.bankName ? errors.bankName : undefined}
        />
        <Input
            label={'Account Number'}
            value={values.account}
            onBlur={handleBlur('account')}
            onChangeText={handleChange('account')}
            errorMsg={touched.account ? errors.account : undefined}
        />
        <Input
            label={'Account Name'}
            value={values.name}
            onBlur={handleBlur('name')}
            onChangeText={handleChange('name')}
            errorMsg={touched.name ? errors.name : undefined}
        />
        <Button isLoading={loader} onPress={handleSubmit} title={'Update Account'}/>
    </>
);

  const renderItem = ({item}: any) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => modalizeRef.current?.open()}>
        <ImageBackground source={PayoutBack} resizeMode="cover" style={[globalStyles.payoutCard]}>
            <Text fontWeight="500" fontSize={hp(17)} text={item.name} />
            <Text style={[globalStyles.Verticalspacing]} fontWeight="500" fontSize={hp(14)} text={item.account + " - " + item.bankName} />
        </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <>
      <View>
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?._id}
            style={{marginBottom: hp(100)}}
        />
        
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
