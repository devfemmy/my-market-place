/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { View, StyleSheet, SafeAreaView, Platform, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { Separator, Text } from '../components/common'
import { colors } from '../utils/themes'
import MobileHeader from './Containers/MobileHeader'
import { globalStyles } from '../styles'
import { hp } from '../utils/helpers'
import { Input } from '../components/common/TextInput'
import { useFormik } from 'formik'
import { LoginSchema } from '../utils/schemas/schemas'
import { LoginFormData } from '../utils/types'
import { Notifier, NotifierComponents } from 'react-native-notifier';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../components/common/Button'
import { AuthButton } from '../components/common/AuthButtons'
import { AppleLogo, GoogleLogo } from '../constants/images'
import appleAuth from '@invertase/react-native-apple-authentication'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { useAppDispatch } from '../redux/hooks'
import { oauthAppleLogin, oauthLogin, signInUser } from '../redux/slices/AuthSlice'
import { getPersonalStore } from '../redux/slices/StoreSlice'
import { doPost } from '../utils/server'

const LoginScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch()

    const initialValues: LoginFormData = {
        email: '',
        password: '',
    };


    const handleCredentialSubmit = async (data: any) => {
        setLoading(true)
        const payload = {
            email: data?.email,
            password: data?.password
        }

        try {
            var response = await dispatch(signInUser(payload))
            if (signInUser.fulfilled.match(response)) {
                
                setLoading(false)
   
                await AsyncStorage.setItem('userInfo', JSON.stringify(response?.payload?.data))
                var resultAction = await dispatch(getPersonalStore())
                if (getPersonalStore.fulfilled.match(resultAction)) {
      
                    var bb = await AsyncStorage.getItem('checking')
            
                    if (bb === 'true') {
                        return navigation.navigate('CartScreen', {
                            params: {
                                renderName: 'none'
                            }
                        })
                    }
                    if (resultAction.payload?.length > 0) {
                        await AsyncStorage.setItem('activeId', resultAction.payload[0]?.id)
                        await AsyncStorage.setItem('activeSlug', resultAction.payload[0]?.slug)
                        await AsyncStorage.setItem('activeName', resultAction.payload[0]?.brand_name)
                        
                        return navigation.navigate('SellerScreen',{ screen: 'Store' })
                    }
                    else {
                         return navigation.navigate('BuyerScreen',{ screen: 'Home' })
                    }
                }
            }
            else {
                var errMsg = response?.payload as string
                setLoading(false)
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            }
        }
        catch (e) {
            console.log({ e })
        }
    }


    // Apple SignIn
    const AppleSignIn = async () => {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        const credentialState = await appleAuth.getCredentialStateForUser(
            appleAuthRequestResponse.user,
        );
        if (credentialState === appleAuth.State.AUTHORIZED) {
            const result = appleAuthRequestResponse;
            setLoading(true)
            try {
                const payload = {
                //   "email": result.email,
                //   "familyName": result?.fullName?.familyName,
                //   "givenName": result?.fullName?.givenName,
                  "identity_token": result?.identityToken,
                  "user": result.user,
                //   "authType":"Apple",
                }
                var response = await dispatch(oauthAppleLogin(payload))
                if (oauthAppleLogin.fulfilled.match(response)) {
                    setLoading(false)
                    await AsyncStorage.setItem('userInfo', JSON.stringify(response?.payload))
                    var resultAction = await dispatch(getPersonalStore())
                    if (getPersonalStore.fulfilled.match(resultAction)) {
                        var bb = await AsyncStorage.getItem('checking')
                        if (bb === 'true') {
                            return navigation.navigate('CartScreen',{
                                params: {
                                    renderName: 'none'
                                }
                            })
                        }
                        if (resultAction.payload?.length > 0) {
                            await AsyncStorage.setItem('activeId', resultAction.payload[0]?.id)
                            await AsyncStorage.setItem('activeSlug', resultAction.payload[0]?.slug)
                            await AsyncStorage.setItem('activeName', resultAction.payload[0]?.brand_name)
    
                            return navigation.navigate('SellerScreen', { screen: 'Store' })
                        }
                        else {
                            return navigation.navigate('BuyerScreen', { screen: 'Home' })
                        }
                    }
                }
                else {
                    setLoading(false)
                    var errMsg = response?.payload as string
                    Notifier.showNotification({
                        title: errMsg,
                        description: '',
                        Component: NotifierComponents.Alert,
                        hideOnPress: false,
                        componentProps: {
                            alertType: 'error',
                        },
                    });
                }
                // return
                // const response1 = await doPost(payload, '/auth/oAuth/apple');
                // console.log('response here', response.data.status);
                // if(response.data.status === 'success'){
                //   try{
                //     await AsyncStorage.setItem("token", response?.data?.data?.accessToken);
                //     // await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));
                //     Notifier.showNotification({
                //       title: 'Login Successful!',
                //       // description: "tghdddfdfd",
                //       Component: NotifierComponents.Alert,
                //       hideOnPress: false,
                //       componentProps: {
                //         alertType: 'success',
                //       },
                //     });
                //     signIn(response?.data?.data?.accessToken)
                //     console.log(response.data.user)
                //   } catch (error){
                //     console.log(error)
                //   }
                // }
                setLoading(false)
              } catch (error) {
                console.log('log error', error)
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
             await GoogleSignin.signIn();
          // const currentUser = await GoogleSignin.getCurrentUser();
            const tokenInfo = await GoogleSignin.getTokens();
            const payload = {
                token: tokenInfo.idToken,

            }

           var response = await dispatch(oauthLogin(payload))
            if (oauthLogin.fulfilled.match(response)) {
                setLoading(false)
                await AsyncStorage.setItem('userInfo', JSON.stringify(response?.payload))
                var resultAction = await dispatch(getPersonalStore())
                if (getPersonalStore.fulfilled.match(resultAction)) {
                    var bb = await AsyncStorage.getItem('checking')
                    if (bb === 'true') {
                        return navigation.navigate('CartScreen',{
                            params: {
                                renderName: 'none'
                            }
                        })
                    }
                    if (resultAction.payload?.length > 0) {
                        await AsyncStorage.setItem('activeId', resultAction.payload[0]?.id)
                        await AsyncStorage.setItem('activeSlug', resultAction.payload[0]?.slug)
                        await AsyncStorage.setItem('activeName', resultAction.payload[0]?.brand_name)

                        return navigation.navigate('SellerScreen', { screen: 'Store' })
                    }
                    else {
                        return navigation.navigate('BuyerScreen', { screen: 'Home' })
                    }
                }
            }
            else {
                setLoading(false)
                var errMsg = response?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            }

        } catch (err: any) {
            console.log(err)
            setLoading(false)
        }
    };

    const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
        useFormik({
            initialValues,
            validationSchema: LoginSchema,
            onSubmit: (data: LoginFormData) => handleCredentialSubmit(data),
        });

        const sellerRoute = async () => {
            await AsyncStorage.setItem('type', "seller")
            return navigation.navigate('SellerSignUpScreen')
        }


    return (
        <SafeAreaView style={globalStyles.containerWrapper}>
            <View style={styles.container}>
                <MobileHeader categoryName={'Sign In'} props={navigation} auth />
                <View style={styles.top}>
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
                    <Text
                        onPress={() => navigation.navigate('ForgetPassword')}
                        fontWeight="500"
                        fontSize={hp(16)}
                        text="Forgot password?"
                        textAlign='right'
                    />
                    <View style={[globalStyles.rowCenter, styles.mt]}>
                        <Button isLoading={loading} title={'Sign in'} onPress={handleSubmit} />
                    </View>
                    <Separator />
                    <View style={[styles.width100]}>
                        <AuthButton
                            image={GoogleLogo}
                            title={'Sign in with Google'}
                            style={styles.btnAuth}
                            onPress={googleSignIn}
                        />
                        {Platform.OS === 'ios' ?
                            <AuthButton
                                image={AppleLogo}
                                title={'Sign in with Apple'}
                                style={styles.btnAuth}
                                onPress={AppleSignIn}
                            /> : null
                        }
                    </View>
                </View>
                <View style={styles.bottom}>
                    <Pressable onPress={() => navigation.navigate('BuyerSignUpScreen')}>
                        <Text text='Create an account' textAlign='center' style={styles.txt} />
                    </Pressable>
                    <Pressable onPress={() => sellerRoute()}>
                        <Text text='Sell on Bazara' textAlign='center' />
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: hp(10)
    },
    top: {
        flex: 10,
        marginTop: hp(30)
    },
    bottom: {
        flex: 1,
    },
    mt: {
        marginTop: hp(30)
    },
    btnAuth: {
        marginBottom: hp(20),
    },
    width100: {
        width: '100%',
        alignSelf: 'center',
    },
    txt: {
        marginVertical: hp(15)
    },
})