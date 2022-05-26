import React, {useState, useContext} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doPost} from '../../../utils/server';
import {AuthContext} from '../../../context/context';

const Register = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const {signIn} = useContext(AuthContext)
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const initialValues: RegisterFormData = {
    fName: '',
    lName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const {values, errors, touched, handleChange, handleSubmit, handleBlur} =
    useFormik({
      initialValues,
      validationSchema: RegisterSchema,
      onSubmit: (data: RegisterFormData) => handleCredentialSubmit(data),
    });
  
  const handleCredentialSubmit = async(data : Object) => {
      setLoading(true)
      try{
        var response = await doPost(data, `/auth/regUser`)
        if(response.data.success === true){
          AsyncStorage.setItem("token", response.data.token);
          AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));
          signIn(response.data.token)
        }
        setLoading(false)
      }catch (e){
        console.log(e)
        setLoading(false)
      }
  }

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
          value={values.fName}
          onBlur={handleBlur('fName')}
          onChangeText={handleChange('fName')}
          errorMsg={touched.fName ? errors.fName : undefined}
        />
        <Input
          label={'Last Name'}
          value={values.lName}
          onBlur={handleBlur('lName')}
          onChangeText={handleChange('lName')}
          errorMsg={touched.lName ? errors.lName : undefined}
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
              isLoading={loading} 
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
