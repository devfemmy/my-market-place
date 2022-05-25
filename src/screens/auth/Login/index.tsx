import React from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text} from '../../../components/common';
import {Input} from '../../../components/common/TextInput';
import {LoginFormData} from '../../../utils/types';
import {LoginSchema} from '../../../utils/constants';
import {Pressable, View} from 'react-native';


type Nav = {
  navigate: (value: string) => void;
}

const Login = (navigation: Nav): JSX.Element => {
  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };
  const {values, errors, touched, handleChange, handleBlur} =
    useFormik({
      initialValues,
      validationSchema: LoginSchema,
      onSubmit: (val: LoginFormData) => console.log(val),
    });
  return (
    <SafeAreaView>
      <Text text="Login" />
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
        errorMsg={touched.password ? errors.password : undefined}
      />
      <Pressable onPress={() => navigation.navigate('StoreCreation')}>
        <View>
          <Text text="Go to store creation" />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
