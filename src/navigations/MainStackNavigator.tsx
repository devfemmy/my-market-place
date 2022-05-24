import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackParamList} from './types';
import {colors} from '../constants';
import {hp} from '../utils';
import {RootBottomTabNavigator} from './RootBottomTabNavigator';
import {StoreCreation} from '../screens';
import {WelcomeScreen} from '../screens/WelcomeScreen';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigator = (): JSX.Element => {
  return (
    <MainStack.Navigator
      screenOptions={() => ({
        headerShown: true,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: hp(12),
        },
        headerBackTitleVisible: false,
        headerTitleAlign: 'left',
        headerTintColor: colors.primaryBg,
      })}>
      <MainStack.Screen
        name="HomeTab"
        component={RootBottomTabNavigator}
        options={() => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="StoreCreationScreen"
        component={StoreCreation}
        options={() => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={() => ({
          headerShown: false,
        })}
      />
    </MainStack.Navigator>
  );
};
