import React from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text, Separator} from '../../../components/common';
import {Input} from '../../../components/common/TextInput';
import {Button} from '../../../components/common/Button';
import {AuthButton} from '../../../components/common/AuthButtons';
import {View, ScrollView} from 'react-native';
import {globalStyles} from '../../../styles';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {RegisterScreenNavigationProp} from '../../../navigations/types';
import { RegisterFormData } from '../../../utils/types';
import { RegisterSchema } from '../../../utils/constants';
import { colors } from '../../../utils/themes';
import { hp } from '../../../utils/helpers';


const Register = (): JSX.Element => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const initialValues: RegisterFormData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const {values, errors, touched, handleChange, handleSubmit, handleBlur} =
    useFormik({
      initialValues,
      validationSchema: RegisterSchema,
      onSubmit: (data: RegisterFormData) => console.log(data),
    });
  return (
    <SafeAreaView>
      <View style={[globalStyles.rowBetween, styles.width90]}>
        <AuthButton
          image={require('../../../assets/images/google.png')}
          title={'Google'}
          style={styles.btn}
          onPress={handleSubmit}
        />
        <AuthButton
          image={require('../../../assets/images/Apple.png')}
          title={'Apple'}
          style={styles.btn}
          onPress={handleSubmit}
        />
      </View>
      <ScrollView>
        <Separator />
        <View style={[globalStyles.rowStart, styles.lowerContainer]}>
          <Text fontWeight="500" fontSize={hp(16)} text="Get started with" />
        </View>

        <Input
          label={'First Name'}
          value={values.firstName}
          onBlur={handleBlur('firstName')}
          onChangeText={handleChange('firstName')}
          errorMsg={touched.firstName ? errors.firstName : undefined}
        />
        <Input
          label={'Last Name'}
          value={values.lastName}
          onBlur={handleBlur('lastName')}
          onChangeText={handleChange('lastName')}
          errorMsg={touched.lastName ? errors.lastName : undefined}
        />
        <Input
          label={'Email Address'}
          value={values.email}
          onBlur={handleBlur('email')}
          onChangeText={handleChange('email')}
          errorMsg={touched.email ? errors.email : undefined}
        />
        <Input
          label={'Phone Number'}
          value={values.phoneNumber}
          onBlur={handleBlur('phoneNumber')}
          onChangeText={handleChange('phoneNumber')}
          errorMsg={touched.phoneNumber ? errors.phoneNumber : undefined}
        />
        <Input
          label={'Password'}
          value={values.password}
          onBlur={handleBlur('password')}
          onChangeText={handleChange('password')}
          isPassword
          errorMsg={touched.password ? errors.password : undefined}
        />
        <Input
          label={'Confirm Password'}
          value={values.confirmPassword}
          onBlur={handleBlur('confirmPassword')}
          onChangeText={handleChange('confirmPassword')}
          isPassword
          errorMsg={
            touched.confirmPassword ? errors.confirmPassword : undefined
          }
        />
        <View>
          <View style={globalStyles.rowCenter}>
            <Button
              title={'Sign up'}
              style={styles.btn}
              onPress={handleSubmit}
            />
          </View>
          <View
            style={[
              globalStyles.rowCenter,
              styles.width90,
              styles.margTop,
              styles.scroll,
            ]}>
            <Text fontWeight="500" text="Already have an account? " />
            <Text
              onPress={() => navigation.navigate('Login')}
              fontWeight="600"
              text="Sign in"
              color={colors.bazaraTint}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
