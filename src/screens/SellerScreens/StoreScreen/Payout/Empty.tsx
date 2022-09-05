import React, {useContext, useRef, useState} from 'react';
import {Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, SafeAreaView, ActivityIndicator} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {UniversityLogo} from '../../../../constants/images';
import { colors } from '../../../../utils/themes';
import { Modalize } from 'react-native-modalize';
import { Select } from '../../../../components/common/SelectInput';
import { Input } from '../../../../components/common/TextInput';
import { styles } from './styles';
import banks from '../../../../utils/banks';
import { useFormik } from 'formik';
import { PayoutFormData } from '../../../../utils/types';
import { PayoutFormDataSchema } from '../../../../utils/constants';
import { addPayout, getPayouts, loading } from '../../../../redux/slices/StoreSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { SearchDropdown } from '../../../../components/common/SearchDropdown';
import { bankVerification } from '../../../../utils/server';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayoutForm } from './PayoutForm';


export const NoAccount = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const loader = useAppSelector(loading)
  const [fetching, setFetching] = useState(false)
  const modalizeRef = useRef(null);

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
      const bankCode = banks.find((bank) => val.bank_name == bank.label)
      // form.bankCode = bankCode.code
      form.store_id = id
      await dispatch(addPayout(form))
      modalizeRef.current?.close()
      await dispatch(getPayouts(id))
    },
  });
  
  const bankList = banks.map((val) => {return val.label})

  const renderHeader = () => (
        <View style={styles.modal__header}>
            <Text style={[globalStyles.rowStart, globalStyles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Payout Account" />
        </View>
  );

  return (
    <>
      <View style={[globalStyles.selfCenter]}>
        <Image source={UniversityLogo} style={[globalStyles.selfCenterImage, globalStyles.Verticalspacing]} resizeMode="contain" />
        <Text style={[globalStyles.Verticalspacing]} fontWeight="500" fontSize={hp(20)} text="No Payout Account" />
        <Text style={[globalStyles.Verticalspacing]} fontWeight="400" color={colors.darkGrey} textAlign='center' fontSize={hp(15)} text="Add your preferred business bank account" />
        <Button 
        title={'Add Account'}
        size='medium'
        style={[globalStyles.Verticalspacing, {height: hp(55)}]}
        onPress={() => modalizeRef.current?.open()} />
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
          btnTitle={'Add Account'}
          />
      </Modalize>
    </>
  );
};
