import React from 'react';
import {createStackNavigator as createNativeStackNavigator} from '@react-navigation/stack';
import {MainStackParamList} from './types';
import { BuyerRootBottomTabNavigator } from './RootBottomTabNavigator';
import { colors } from '../../utils/themes';
import {hp} from '../../utils/helpers';
import { Cart, Notifications } from '../../screens/BuyerScreens';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export const BuyerMainStackNavigator = (): JSX.Element => {
  return (
    <MainStack.Navigator
      screenOptions={() => ({
        headerShown: true,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: hp(15),
        },
        headerStyle: {
          backgroundColor: colors.primaryBg,
        },
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTintColor: colors.darkGrey,
        
      })}>
      <MainStack.Screen
        name="MainScreen"
        component={BuyerRootBottomTabNavigator}
        options={() => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="Cart"
        component={Cart}
        options={() => ({
          headerShown: true,
          headerTitle: 'My Cart'
        })}
      />
      <MainStack.Screen
        name="Notifications"
        component={Notifications}
        options={() => ({
          headerShown: true,
        })}
      />
    </MainStack.Navigator>
  );
};
