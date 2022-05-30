import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text} from '../../../components/common';
import {View} from 'react-native';
import {styles} from './styles';
import {Input} from '../../../components/common/TextInput';
import {Button} from '../../../components/common/Button';
import {globalStyles} from '../../../styles';
import {ForgotPasswordScreenNavigationProp} from '../../../navigations/types';
import { ForgotPasswordFormData } from '../../../utils/types';
import { ForgotPasswordSchema } from '../../../utils/constants';
import { hp } from '../../../utils/helpers';
import {doPost} from '../../../utils/server';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const initialValues: ForgotPasswordFormData = {
    email: '',
  };
  const {values, errors, touched, handleChange, handleSubmit, handleBlur} =
    useFormik({
      initialValues,
      validationSchema: ForgotPasswordSchema,
      onSubmit: (data: ForgotPasswordFormData) => {
        handleCredentialSubmit(data);
      },
    });

  const handleCredentialSubmit = async (data: ForgotPasswordFormData) => {
      setLoading(true)
      try{
        const response = await doPost(data, `/auth/request_reset`)
        if(response.data.success === true){
          navigation.navigate('LinkSent');
        }
        setLoading(false)
      }catch (e){
        console.log(e)
        setLoading(false)
      }
  }

  return (
    <SafeAreaView>
      {/* <Text onPress={() => navigation.goBack()} text="Back to login" /> */}
      <View style={styles.upperContainer}>
        <Text
          fontWeight="300"
          fontSize={hp(17)}
          lineHeight={hp(27)}
          text="Provide the email address asssociated with your account and we will send you instructions to set a new password."
        />
      </View>
      <Input
        label={'Email'}
        value={values.email}
        onBlur={handleBlur('email')}
        onChangeText={handleChange('email')}
        errorMsg={touched.email ? errors.email : undefined}
      />
      <View style={globalStyles.rowCenter}>
        <Button isLoading={loading} title={'Send link'} style={styles.btn} onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
