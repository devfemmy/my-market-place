import React from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text, Separator} from '../../../components/common';
import {Input} from '../../../components/common/TextInput';
import {LoginFormData} from '../../../models';
import {LoginSchema} from '../../../constants';
import {hp} from '../../../utils';
import {View} from 'react-native';
import {globalStyles} from '../../../styles';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {LoginScreenNavigationProp} from '../../../navigations/types';

const Login = (): JSX.Element => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };
  const {values, errors, touched, handleChange, handleSubmit, handleBlur} =
    useFormik({
      initialValues,
      validationSchema: LoginSchema,
      onSubmit: (values: LoginFormData) => console.log(values),
    });
  return (
    <SafeAreaView>
      <Separator />
      <View style={[globalStyles.rowStart, styles.lowerContainer]}>
        <Text fontWeight="500" fontSize={hp(16)} text="Sign in with your:" />
      </View>

      <Input
        label={'Email'}
        value={values.email}
        onBlur={handleBlur('email')}
        onChangeText={handleChange('email')}
        errorMsg={touched.email ? errors.email : undefined}
      />
      <Input
        label={'Password'}
        value={values.password}
        onBlur={handleBlur('password')}
        onChangeText={handleChange('password')}
        isPassword
        errorMsg={touched.password ? errors.password : undefined}
      />
      <View style={[globalStyles.rowStart, styles.width90]}>
        <Text
          onPress={() => navigation.navigate('ForgotPassword')}
          fontWeight="500"
          text="Forgot password?"
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;
