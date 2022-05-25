import React from 'react';
import {useFormik} from 'formik';
import {SafeAreaView, Text, Separator} from '../../../components/common';
import {Input} from '../../../components/common/TextInput';
import {Button} from '../../../components/common/Button';
import {AuthButton} from '../../../components/common/AuthButtons';
import {View, Alert} from 'react-native';
import {globalStyles} from '../../../styles';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {LoginScreenNavigationProp} from '../../../navigations/types';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { LoginFormData } from '../../../utils/types';
import { LoginSchema } from '../../../utils/constants';
import { hp } from '../../../utils/helpers';

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
      onSubmit: (data: LoginFormData) => console.log(data),
    });
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
      var result = appleAuthRequestResponse;
      try {
        // setShowLoading(true)
        console.log(result);
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
  const googleSignIn = async () => {
    await GoogleSignin.hasPlayServices();
    // const userInfo = await GoogleSignin.signIn();
    // const tokenInfo = await GoogleSignin.getTokens();
  };
  return (
    <SafeAreaView>
      <View style={[globalStyles.rowBetween, styles.width90]}>
        <AuthButton
          image={require('../../../assets/images/google.png')}
          title={'Google'}
          style={styles.btn}
          onPress={() => googleSignIn()}
        />
        <AuthButton
          image={require('../../../assets/images/Apple.png')}
          title={'Apple'}
          style={styles.btn}
          onPress={() => AppleSignIn()}
        />
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
      <View style={globalStyles.footer}>
        <View style={globalStyles.rowCenter}>
          <Button title={'Sign in'} style={styles.btn} onPress={handleSubmit} />
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
