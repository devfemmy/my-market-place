import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text} from '../../../components/common';
import {View} from 'react-native';
import {hp} from '../../../utils';
import {styles} from './styles';
import {Input} from '../../../components/common/TextInput';
import {Button} from '../../../components/common/Button';
import {ForgotPasswordFormData} from '../../../models';
import {ForgotPasswordSchema} from '../../../constants';
import {globalStyles} from '../../../styles';
import {ForgotPasswordScreenNavigationProp} from '../../../navigations/types';

const ForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const initialValues: ForgotPasswordFormData = {
    email: '',
  };
  const {values, errors, touched, handleChange, handleSubmit, handleBlur} =
    useFormik({
      initialValues,
      validationSchema: ForgotPasswordSchema,
      onSubmit: (data: ForgotPasswordFormData) => {
        console.log(data);
        navigation.navigate('LinkSent');
      },
    });
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
        <Button title={'Send link'} style={styles.btn} onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
