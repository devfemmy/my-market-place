import React, {useState, useContext} from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text, Separator} from '../../../components/common';
import {Input} from '../../../components/common/TextInput';
import {Button} from '../../../components/common/Button';
import {AuthButton} from '../../../components/common/AuthButtons';
import {View, ScrollView, Alert} from 'react-native';
import {globalStyles} from '../../../styles';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {RegisterScreenNavigationProp} from '../../../navigations/types';
import { RegisterFormData } from '../../../utils/types';
import { RegisterSchema } from '../../../utils/constants';
import { globalTheme } from '../../../utils/themes';
import { hp } from '../../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doPost} from '../../../utils/server';
import {AuthContext} from '../../../context/context';

import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

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

  const googleSignUp = async () => {
    setLoading(true)
    try {
      await GoogleSignin.hasPlayServices();
      //const currentUser = await GoogleSignin.getCurrentUser();
      const userInfo = await GoogleSignin.signIn();
      const tokenInfo = await GoogleSignin.getTokens();
      const payload = {
        "authToken": tokenInfo.idToken,
        "authType": "google",
        "account": {
          "type": "sidehustle",
          "variant": "seller"
        }
      }
      const response = await doPost(payload, '/auth/login/oAuthGo')
      if(response.data.success === true){
        try{
          await AsyncStorage.setItem("token", response.data.token);
          await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));
        } catch (error){
          console.log(error)
        }
        signIn(response.data.token)
        console.log(response.data.user)
      }
      setLoading(false)
    }catch(err){
      console.log(err)
      setLoading(false)
    }
  };

  const AppleSignUp = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    if (credentialState === appleAuth.State.AUTHORIZED) {
      var result = appleAuthRequestResponse;
      try {
        var payload = {
          //"email": result.email,
          "familyName": result?.fullName?.familyName,
          "givenName": result?.fullName?.givenName,
          "identityToken": result?.identityToken,
          "user": result.user
          //"authType":"Apple",
        }
        const response = await doPost(payload, '/auth/login/oAuthApple')
        if(response.data.success === true){
          try{
            await AsyncStorage.setItem("token", response.data.token);
            await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));
          } catch (error){
            console.log(error)
          }
          signIn(response.data.token)
          console.log(response.data.user)
        }
        setLoading(false)
      } catch (error) {
        Alert.alert(
          'Authentication failed',
          'Authentication was unsuccessful, kindly try again',
        );
      }
      // user is authenticated
    } else {
      Alert.alert(
        'Authentication failed',
        'Authentication was unsuccessful, kindly try again',
      );
    }
  };

  return (
    <SafeAreaView>
      <View style={[globalStyles.rowBetween, styles.width90]}>
        <AuthButton
          image={require('../../../assets/images/google.png')}
          title={'Google'}
          style={styles.btn}
          onPress={googleSignUp}
        />
        <AuthButton
          image={require('../../../assets/images/Apple.png')}
          title={'Apple'}
          style={styles.btn}
          onPress={AppleSignUp}
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
              color={globalTheme.bazaraTint}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
