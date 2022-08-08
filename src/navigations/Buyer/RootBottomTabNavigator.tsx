import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Home, Explore, Orders, Inbox, Profile } from '../../screens/BuyerScreens';
import {RootBottomTabParamList} from './types';
import {hp} from '../../utils/helpers';
import { colors } from '../../utils/themes';
import { HomeStackNavigator } from '../../screens/BuyerScreens/main/Home/stack';
import { ExploreStackNavigator } from '../../screens/BuyerScreens/main/Explore/stack';

const RootBottomTab = createBottomTabNavigator<RootBottomTabParamList>();

export const BuyerRootBottomTabNavigator = (): JSX.Element => {
  return (
    <RootBottomTab.Navigator
      screenOptions={({route}) => ({
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: hp(15),
        },
        headerStyle: {
          backgroundColor: colors.primaryBg,
        },
        headerTintColor: colors.darkGrey,
        tabBarStyle: {backgroundColor: colors.primaryBg, borderTopColor: colors.darkBlack},
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          if (route.name === 'HomeStackNavigator') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'ExploreStackNavigator') {
            iconName = 'search';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'cart' : 'cart-outline';
          }
          if (route.name === 'Inbox') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          }
          if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.bazaraTint,
        tabBarInactiveTintColor: colors.gray,
        tabBarHideOnKeyboard: true,
      })}>
      <RootBottomTab.Screen name="HomeStackNavigator" options={{title: 'Home'}} component={HomeStackNavigator} />
      <RootBottomTab.Screen name="ExploreStackNavigator" options={{title: 'Explore'}} component={ExploreStackNavigator} />
      <RootBottomTab.Screen name="Orders" component={Orders} />
      <RootBottomTab.Screen name="Inbox" component={Inbox} />
      <RootBottomTab.Screen name="Profile" options={{headerShown: true}} component={Profile} />
    </RootBottomTab.Navigator>
  );
};
