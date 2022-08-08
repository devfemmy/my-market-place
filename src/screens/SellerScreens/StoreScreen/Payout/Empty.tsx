import React, {useContext, useRef} from 'react';
import {Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, SafeAreaView} from 'react-native';
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
export const NoAccount = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const loader = useAppSelector(loading)
  const modalizeRef = useRef(null);

  const initialValues: PayoutFormData = {
    name: '',
    account: '',
    bankName: '',
  };
  

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } =
  useFormik({
    initialValues,
    validationSchema: PayoutFormDataSchema,
    onSubmit: async (val: PayoutFormData) => {
      let form = val
      const bankCode = banks.find((bank) => val.bankName == bank.label)
      form.bankCode = bankCode.code
      await dispatch(addPayout(form))
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
            <Button isLoading={loader} onPress={handleSubmit} title={'Add Payout Account'}/>
        </>
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
          {renderBody()}
          
      </Modalize>
    </>
  );
};
