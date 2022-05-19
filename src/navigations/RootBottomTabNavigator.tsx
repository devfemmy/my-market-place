import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Home} from '../screens';
import {RootBottomTabParamList} from './types';
import {hp} from '../utils';
import {colors} from '../constants';

const RootBottomTab = createBottomTabNavigator<RootBottomTabParamList>();

export const RootBottomTabNavigator = (): JSX.Element => {
  return (
    <RootBottomTab.Navigator
      screenOptions={({route}) => ({
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: hp(12),
        },
        tabBarStyle: {backgroundColor: colors.primaryBg},
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.bazaraTint,
        tabBarInactiveTintColor: colors.gray,
        tabBarHideOnKeyboard: true,
      })}>
      <RootBottomTab.Screen name="Home" component={Home} />
    </RootBottomTab.Navigator>
  );
};
