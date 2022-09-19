import React from 'react';
import {createStackNavigator as createNativeStackNavigator} from '@react-navigation/stack';

import {AuthStackParamList} from './Seller/types';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';
import LinkSent from '../screens/auth/LinkSent';
import { StoreScreen } from '../screens/SellerScreens/StoreScreen';
import { StoreCreation } from '../screens/SellerScreens';
import { OnboardScreen } from '../screens/Onboarding';
import StoreSuccessScreen from '../screens/SellerScreens/StoreSuccessScreen';
import { colors } from '../utils/themes';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator = (): JSX.Element => {
  return (
    <AuthStack.Navigator
      initialRouteName="OnboardScreen"
      screenOptions={() => ({
        headerShown: false,
        headerTintColor: colors.white,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: colors.primaryBg}
      })}>
      <AuthStack.Screen name="OnboardScreen" component={OnboardScreen} />
      <AuthStack.Screen options={{title: 'Sign in', headerShown: true}} name="Login" component={Login} />
      <AuthStack.Screen options={{title: 'Create an Account', headerShown: true, headerBackTitleVisible: false}} name="Register" component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="LinkSent" component={LinkSent} />
      <AuthStack.Screen name="Store" component={StoreScreen} />
      <AuthStack.Screen name="StoreCreationScreen" component={StoreCreation} />
      <AuthStack.Screen name="StoreSuccessScreen" component={StoreSuccessScreen} />
    </AuthStack.Navigator>
  );
};
