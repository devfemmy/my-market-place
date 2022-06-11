import React, {useState, useContext, useEffect, useCallback} from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text, Separator} from '../../../components/common';
import {Input} from '../../../components/common/TextInput';
import {Button} from '../../../components/common/Button';
import {AuthButton} from '../../../components/common/AuthButtons';
import {View, Alert, Platform} from 'react-native';
import {globalStyles} from '../../../styles';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {LoginScreenNavigationProp} from '../../../navigations/types';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { LoginFormData } from '../../../utils/types';
import { LoginSchema } from '../../../utils/constants';
import { hp } from '../../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doPost} from '../../../utils/server';
import {AuthContext} from '../../../context/context';
import { AppleLogo, GoogleLogo } from '../../../constants/images';
import CustomModal from '../../../components/common/CustomModal';

import {Notifier, NotifierComponents} from 'react-native-notifier';

const Login = (): JSX.Element => {

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    if (Platform.OS === 'ios') {
      return appleAuth.onCredentialRevoked(() => {
        console.log('If this function executes, User Credentials have been Revoked');
      });
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [visibleBoolean, setVisibleBoolen] = useState<boolean>(true);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(true);
  const {signIn} = useContext(AuthContext)
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };

  

  const {values, errors, touched, handleChange, handleSubmit, handleBlur} =
    useFormik({
      initialValues,
      validationSchema: LoginSchema,
      onSubmit: (data: LoginFormData) => handleCredentialSubmit(data),
    });
  // Apple SignIn
  const AppleSignIn = async () => {
    setLoading(true)
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
        if(response.data.success === true){
          try{
            await AsyncStorage.setItem("token", response.data.token);
            await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));
            Notifier.showNotification({
              title: 'Login Successful!',
              // description: "tghdddfdfd",
              Component: NotifierComponents.Alert,
              hideOnPress: false,
              componentProps: {
                alertType: 'success',
              },
            });
            signIn(response.data.token)
            console.log(response.data.user)
          } catch (error){
            console.log(error)
          }
        }
        setLoading(false)
      } catch (error) {
        Notifier.showNotification({
          title: 'Login failed!',
          description: 'Authentication was unsuccessful, kindly try again',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'error',
          },
        });
        setLoading(false)
      }
      // user is authenticated
    } else {
      Notifier.showNotification({
        title: 'Login failed!',
        description: 'Authentication was unsuccessful, kindly try again',
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'error',
        },
      });
      setLoading(false)
    }
  };

  const googleSignIn = async () => {
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
          Notifier.showNotification({
            title: 'Login Successful!',
            // description: "tghdddfdfd",
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
              alertType: 'success',
            },
          });
          signIn(response.data.token)
          console.log(response.data.user)
        } catch (error){
          console.log(error)
        }
      }
      setLoading(false)
    }catch(err){
      Notifier.showNotification({
        title: 'Login failed!',
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

  const handleCredentialSubmit = async(data : LoginFormData) => {
    setLoading(true)
    try{
      const response = await doPost(data, `/auth/login`)
      if(response.data.success === true){
        try{
          await AsyncStorage.setItem("token", response.data.token);
          await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));
          Notifier.showNotification({
            title: 'Login Successful!',
            // description: "tghdddfdfd",
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
              alertType: 'success',
            },
          });
          console.log(response.data.token)
          signIn(response.data.token)
          console.log(response.data.user)
        } catch (error){
          console.log(error)
        }
      }
      setLoading(false)
    }catch (e){
      Notifier.showNotification({
        title: 'Login failed!',
        description: 'Authentication was unsuccessful, kindly try again',
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
  const handleVisible = useCallback(() => {
    setVisibleBoolen(!visibleBoolean);
  }, [visibleBoolean]);

  return (
    <SafeAreaView>
      <View style={[globalStyles.rowBetween, styles.width90]}>
        <AuthButton
          image={GoogleLogo}
          title={'Google'}
          style={styles.btn}
          onPress={googleSignIn}
        />
        {Platform.OS === 'ios' ? 
            <AuthButton
            image={AppleLogo}
            title={'Apple'}
            style={styles.btn}
            onPress={AppleSignIn}
          /> : null    
      }
      </View>
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
          fontSize={hp(13)}
          text="Forgot password?"
        />
      </View>
      <CustomModal 
        msg="You have successfully updated your store information" 
        headerText="Success" 
        visibleBoolean={visibleBoolean} handleVisible={handleVisible} 
        isSuccess={isSuccessful} />
      <View style={globalStyles.footer}>
        <View style={globalStyles.rowCenter}>
          <Button isLoading={loading} title={'Sign in'} style={styles.btn} onPress={handleSubmit} />
        </View>
        <View style={[globalStyles.rowCenter, styles.width90, styles.margTop]}>
          <Text
            onPress={() => navigation.navigate('Register')}
            fontWeight="500"
            text="Create an account?"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
