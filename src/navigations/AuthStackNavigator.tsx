import React from 'react';
import {createStackNavigator as createNativeStackNavigator} from '@react-navigation/stack';

import {AuthStackParamList} from './types';
import Login from '../screens/auth/Login';
import ForgotPassword from '../screens/auth/ForgotPassword';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator = (): JSX.Element => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={() => ({
        headerShown: false,
      })}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
};
