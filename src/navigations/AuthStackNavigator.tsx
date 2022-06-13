import React from 'react';
import {createStackNavigator as createNativeStackNavigator} from '@react-navigation/stack';

import {AuthStackParamList} from './types';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';
import LinkSent from '../screens/auth/LinkSent';
import { StoreScreen } from '../screens/StoreScreen';
import { StoreCreation } from '../screens';
import StoreSuccessScreen from '../screens/StoreSuccessScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator = (): JSX.Element => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={() => ({
        headerShown: false,
      })}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="LinkSent" component={LinkSent} />
      <AuthStack.Screen name="Store" component={StoreScreen} />
      <AuthStack.Screen name="StoreCreationScreen" component={StoreCreation} />
      <AuthStack.Screen name="StoreSuccessScreen" component={StoreSuccessScreen} />
    </AuthStack.Navigator>
  );
};
