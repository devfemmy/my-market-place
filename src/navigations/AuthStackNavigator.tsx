import React from 'react';
import {createStackNavigator as createNativeStackNavigator} from '@react-navigation/stack';

import {AuthStackParamList} from './types';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';
import LinkSent from '../screens/auth/LinkSent';

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
    </AuthStack.Navigator>
  );
};
