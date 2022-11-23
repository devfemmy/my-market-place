/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, {useState, useContext} from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text, Separator} from '../../../components/common';
import {Input} from '../../../components/common/TextInput';
import {Button} from '../../../components/common/Button';
import {AuthButton} from '../../../components/common/AuthButtons';
import {View, ScrollView, Alert, Platform} from 'react-native';
import {globalStyles} from '../../../styles';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {RegisterScreenNavigationProp} from '../../../navigations/Seller/types';
import { RegisterFormData } from '../../../utils/types';
import { RegisterSchema } from '../../../utils/constants';
import { colors } from '../../../utils/themes';
import { hp } from '../../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doPost} from '../../../utils/server';
import {AuthContext} from '../../../context/context';

import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { AppleLogo, GoogleLogo } from '../../../constants/images';

import {Notifier, NotifierComponents} from 'react-native-notifier';

const Register = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const {authContext: { signIn }} = useContext(AuthContext)
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const initialValues: RegisterFormData = {
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
  };
  const {values, errors, touched, handleChange, handleSubmit, handleBlur} =
    useFormik({
      initialValues,
      validationSchema: RegisterSchema,
      onSubmit: (data: RegisterFormData) => handleCredentialSubmit(data),
    });
  
  const handleCredentialSubmit = async(data : RegisterFormData) => {
      setLoading(true)
      try{
        
        // delete data.confirmPassword
        // delete data.phoneNumber
        console.log(data)

        const response = await doPost(data, `/auth`)
        if(response.data.data.accessToken){
          await AsyncStorage.setItem("token", response.data.data.accessToken);
          await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.data));
          Notifier.showNotification({
            title: 'Registration Successful!',
            // description: "tghdddfdfd",
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
              alertType: 'success',
            },
          });
          navigation.navigate('StoreCreationScreen')
        //   setTimeout(function(){
        //     signIn(response.data.data.accessToken) 
        //  }, 2000);
        }
        setLoading(false)
      }catch (e){
        Notifier.showNotification({
          title: 'Registration failed!',
          description: e?.message,
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'error',
          },
        });
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
      if(response.data.data.accessToken){
        try{
          await AsyncStorage.setItem("token", response.data.data.accessToken);
          await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.data));
          Notifier.showNotification({
            title: 'Registration Successful!',
            // description: "tghdddfdfd",
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
              alertType: 'success',
            },
          });
          navigation.navigate('StoreCreationScreen')
        //   setTimeout(function(){
        //     signIn(response.data.data.accessToken) 
        //  }, 2000);
          console.log(response.data.data)
        } catch (error){
          console.log(error)
        }
      }
      setLoading(false)
    }catch(err){
      Notifier.showNotification({
        title: 'Registration failed!',
        description: 'Authentication was unsuccessful, kindly try again',
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'error',
        },
      });
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
      const result = appleAuthRequestResponse;
      try {
        const payload = {
          //"email": result.email,
          "familyName": result?.fullName?.familyName,
          "givenName": result?.fullName?.givenName,
          "identityToken": result?.identityToken,
          "user": result.user
          //"authType":"Apple",
        }
        const response = await doPost(payload, '/auth/login/oAuthApple')
        if(response.data.data.accessToken){
          try{
            await AsyncStorage.setItem("token", response.data.data.accessToken);
            await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.data));
            Notifier.showNotification({
              title: 'Registration Successful!',
              // description: "tghdddfdfd",
              Component: NotifierComponents.Alert,
              hideOnPress: false,
              componentProps: {
                alertType: 'success',
              },
            });
            navigation.navigate('StoreCreationScreen')
            // setTimeout(function(){
            //     signIn(response.data.data.accessToken) 
            // }, 2000);
            console.log(response.data.data)
          } catch (error){
            console.log(error)
          }
        }
        setLoading(false)
      } catch (error) {
        Notifier.showNotification({
          title: 'Registration failed!',
          description: 'Authentication was unsuccessful, kindly try again',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'error',
          },
        });
      }
      // user is authenticated
    } else {
      Notifier.showNotification({
        title: 'Registration failed!',
        description: 'Authentication was unsuccessful, kindly try again',
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'error',
        },
      });
    }
  };

  return (
    <View style={globalStyles.wrapper}>
      <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Input
          label={'First Name'}
          value={values.first_name}
          onBlur={handleBlur('first_name')}
          onChangeText={handleChange('first_name')}
          errorMsg={touched.first_name ? errors.first_name : undefined}
        />
        <Input
          label={'Last Name'}
          value={values.last_name}
          onBlur={handleBlur('last_name')}
          onChangeText={handleChange('last_name')}
          errorMsg={touched.last_name ? errors.last_name : undefined}
        />
        <Input
          label={'Email Address'}
          value={values.email}
          onBlur={handleBlur('email')}
          onChangeText={handleChange('email')}
          errorMsg={touched.email ? errors.email : undefined}
        />
        <Input
          number
          label={'Phone Number'}
          value={values.phone_number}
          onBlur={handleBlur('phone_number')}
          onChangeText={handleChange('phone_number')}
          errorMsg={touched.phone_number ? errors.phone_number : undefined}
        />
        <Input
          label={'Password'}
          value={values.password}
          onBlur={handleBlur('password')}
          onChangeText={handleChange('password')}
          isPassword
          errorMsg={touched.password ? errors.password : undefined}
        />
        <View style={globalStyles.rowCenter}>
            <Button
              title={'Sign up'}
              isLoading={loading} 
              style={styles.btn}
              onPress={handleSubmit}
            />
        </View>
        <Separator />
        <View style={[styles.width90]}>
          <AuthButton
            image={GoogleLogo}
            title={'Sign in with Google'}
            style={styles.btnAuth}
            onPress={googleSignUp}
          />
          {Platform.OS === 'ios' ? 
          <AuthButton
          image={AppleLogo}
          title={'Sign in with Apple'}
          style={styles.btnAuth}
          onPress={AppleSignUp}
        /> : null    
        }
        </View>
        {/* <Input
          label={'Confirm Password'}
          value={values.confirmPassword}
          onBlur={handleBlur('confirmPassword')}
          onChangeText={handleChange('confirmPassword')}
          isPassword
          errorMsg={
            touched.confirmPassword ? errors.confirmPassword : undefined
          }
        /> */}
        <View>
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
    </View>
  );
};

export default Register;
