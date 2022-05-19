import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthStackParamList} from './types';
import Login from '../screens/auth/Login';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator = (): JSX.Element => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={() => ({
        headerShown: false,
      })}>
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
};
