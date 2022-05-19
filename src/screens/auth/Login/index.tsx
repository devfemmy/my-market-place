import React from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text} from '../../../components/common';
import {Input} from '../../../components/common/TextInput';
import {LoginFormData} from '../../../models';
import {LoginSchema} from '../../../constants';

const Login = (): JSX.Element => {
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
    </SafeAreaView>
  );
};

export default Login;
