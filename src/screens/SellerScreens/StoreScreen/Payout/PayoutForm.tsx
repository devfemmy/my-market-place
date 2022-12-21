import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, ActivityIndicator} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {NoProducts} from '../../../../constants/images';
import {NoAccount} from './Empty';
import { SearchDropdown } from '../../../../components/common/SearchDropdown';
import { Input } from '../../../../components/common/TextInput';
import banks from '../../../../utils/banks';
import { colors } from '../../../../utils/themes';
import { bankVerification } from '../../../../utils/server';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { styles } from './styles';

export const PayoutForm = ({
    bankName,
    accountNumber,
    accountName,
    setField,
    handleBlur,
    touched,
    errors,
    isValid,
    loader,
    handleSubmit,
    btnTitle,
    
}) => {

    const [fetching, setFetching] = useState(false)

    const bankList = banks.map((val) => {return val.label})

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
              setField('account_name', response?.data?.data?.account_name)
            }else{
              setFetching(false)
              setField('account_name', '')
            }
          } catch (error) {
            console.log(error)
            setFetching(false)
            setField('account_name', '')
          }
        }else{
            setField('account_name', '')
        }
    }

    const colorChange = (color: string) => {
        if(accountNumber?.length < 10){
          return 'transparent'
        }
        if(accountName == ''){
          return colors.cancelled
        }
        else{
          return color
        }
    }

  return (
        <>
            <SearchDropdown
                items={bankList}
                defaultValue={bankName}
                placeholder={'Bank'}
                setState={(value) => {setField('bank_name', value); setField('account_name', ''); setField('bank_account_number', '')}}
                errorMsg={touched.bank_name ? errors.bank_name : undefined}
            />
            <Input
                label={'Account Number'}
                value={accountNumber}
                onBlur={handleBlur(accountNumber)}
                onChangeText={(text) => {setField('bank_account_number', text), validateAccount(text, bankName)}}
                errorMsg={touched.bank_account_number ? errors.bank_account_number : undefined}
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
            color={accountNumber?.length < 10 ? 'transparent' : colors.white} 
            fontWeight="400" fontSize={hp(13)} 
            text={accountName == '' ? 'Invalid Account' : accountName} />
            }

            <Ionicons name="checkmark-circle-outline" size={24} color={colorChange("#fff")} />
            </View>
            <Button style={{backgroundColor: !isValid ? colors.darkBlack : colors.bazaraTint}} disabled={!isValid} isLoading={loader} onPress={handleSubmit} title={btnTitle}/>
        </>
  );
};
