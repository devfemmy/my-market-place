import { View, StyleSheet, SafeAreaView, ScrollView, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Separator, Text } from '../components/common'
import { colors } from '../utils/themes'
import MobileHeader from './Containers/MobileHeader'
import { globalStyles } from '../styles'
import { hp } from '../utils/helpers'
import { useFormik } from 'formik'
import { RegisterSchema } from '../utils/schemas'
import { RegisterFormData } from '../utils/types'
import { Input } from '../components/common/TextInput'
import { Button } from '../components/common/Button'
import { AppleLogo, GoogleLogo } from '../constants/images'
import { AuthButton } from '../components/common/AuthButtons'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import appleAuth from '@invertase/react-native-apple-authentication'
import { useAppDispatch } from '../redux/hooks'
import { createUser, oauthSignup } from '../redux/slices/AuthSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BuyerSignUpScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const initialValues: RegisterFormData = {
        firstName: '',
        lastName: '',
        // phone_number: '',
        email: '',
        password: '',
    };
    const handleCredentialSubmit = async (data: any) => {
        const payload = {
            fName: data.firstName,
            lName: data.lastName,
            password: data.password,
            // mobile: data.phoneNumber,
            email: data.email,
        };

        try {
            setLoading(true)
            const resultAction = await dispatch(createUser(payload))
            if (createUser.fulfilled.match(resultAction)) {
                await AsyncStorage.setItem('userInfo', JSON.stringify(resultAction?.payload?.data))
                var bb = await AsyncStorage.getItem('checking')
                if (bb === 'true') {
                    return navigation.navigate('CartScreen',{
                        params: {
                            renderName: 'none'
                        }
                    })
                }           
                setLoading(false)
                return navigation.navigate('BuyerScreen')
            } else {
                const errorMsg = resultAction.payload as string
                setLoading(false)
                Notifier.showNotification({
                    title: errorMsg,
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
            console.log(e)
        }
    }


    const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
        useFormik({
            initialValues,
            validationSchema: RegisterSchema,
            onSubmit: (data: RegisterFormData) => handleCredentialSubmit(data),
        });


    const googleSignUp = async () => {
        setLoading(true)
        try {
            await GoogleSignin.hasPlayServices();
            //const currentUser = await GoogleSignin.getCurrentUser();
            const userInfo = await GoogleSignin.signIn();
            const tokenInfo = await GoogleSignin.getTokens();
            const payload = {
                token: tokenInfo.idToken,
            }

            var resultAction = await dispatch(oauthSignup(payload))
            if (oauthSignup.fulfilled.match(resultAction)) {
                await AsyncStorage.setItem('userInfo', JSON.stringify(resultAction?.payload))
                setLoading(false)
                return navigation.navigate('BuyerScreen')
            } else {
                const errorMsg = resultAction.payload as string
                Notifier.showNotification({
                    title: errorMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            }
        }
        catch (err) {
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
                // const response = await doPost(payload, '/auth/login/oAuthApple')
                // if(response.data.data.accessToken){
                //   try{
                //     await AsyncStorage.setItem("token", response.data.data.accessToken);
                //     await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.data));
                //     Notifier.showNotification({
                //       title: 'Registration Successful!',
                //       // description: "tghdddfdfd",
                //       Component: NotifierComponents.Alert,
                //       hideOnPress: false,
                //       componentProps: {
                //         alertType: 'success',
                //       },
                //     });
                //     navigation.navigate('StoreCreationScreen')
                //     // setTimeout(function(){
                //     //     signIn(response.data.data.accessToken) 
                //     // }, 2000);
                //     console.log(response.data.data)
                //   } catch (error){
                //     console.log(error)
                //   }
                // }
                // setLoading(false)
            } catch (error) {

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
        <SafeAreaView style={globalStyles.containerWrapper}>
            <View style={styles.container}>
                <MobileHeader categoryName={'Sign Up'} props={navigation} auth />
                <View style={styles.top}>
                    <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
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
                            label={'Password'}
                            value={values.password}
                            onBlur={handleBlur('password')}
                            onChangeText={handleChange('password')}
                            isPassword
                            errorMsg={touched.password ? errors.password : undefined}
                        />
                        <View style={[globalStyles.rowCenter, styles.mt]}>
                            <Button
                                title={'Sign up'}
                                isLoading={loading}
                                onPress={handleSubmit}
                            />
                        </View>
                        <Separator />
                        <View style={[styles.width100]}>
                            <AuthButton
                                image={GoogleLogo}
                                title={'Sign in with Google'}
                                style={styles.btnAuth}
                                onPress={googleSignUp}
                            />
                            {Platform.OS !== 'ios' ?
                                <AuthButton
                                    image={AppleLogo}
                                    title={'Sign in with Apple'}
                                    style={styles.btnAuth}
                                    onPress={AppleSignUp}
                                /> : null
                            }
                        </View>
                    </ScrollView>
                </View>

                <View style={[styles.bottom]}>
                    <Pressable onPress={() => navigation.navigate('LoginScreen')}>
                        <View style={styles.ttt}>
                            <Text text='Already have an account?' />
                            <Text text='Sign in' color={colors.bazaraTint} style={styles.tt2} />
                        </View>
                    </Pressable>
                </View>

            </View>
        </SafeAreaView>
    )
}

export default BuyerSignUpScreen

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
    btnAuth: {
        marginBottom: hp(20),
    },
    width100: {
        width: '100%',
        alignSelf: 'center',
    },
    ttt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tt2: {
        marginLeft: hp(5)
    },
    mt: {
        marginTop: hp(30)
    },
})