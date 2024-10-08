import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Home} from '../../screens/SellerScreens';
import {Product} from '../../screens/SellerScreens';
import {Order} from '../../screens/SellerScreens';
import {RootBottomTabParamList} from './types';
import {hp} from '../../utils/helpers';
import { colors } from '../../utils/themes';
import { StoreScreen } from '../../screens/SellerScreens/StoreScreen';
import Setting from '../../screens/SellerScreens/SettingScreen';

const RootBottomTab = createBottomTabNavigator<RootBottomTabParamList>();

export const SellerRootBottomTabNavigator = (): JSX.Element => {
  return (
    <RootBottomTab.Navigator
      screenOptions={({route}) => ({
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: hp(12),
        },
        tabBarStyle: {backgroundColor: colors.primaryBg, borderTopColor: colors.darkBlack},
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          if (route.name === 'Store') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Product') {
            iconName = focused ? 'cube-outline' : 'cube-outline';
          } else if (route.name === 'Order') {
            iconName = focused ? 'medkit-outline' : 'medkit-outline';
          }
          if (route.name === 'Inbox') {
            iconName = focused ? 'chatbubble-outline' : 'chatbubble-outline';
          }
          if (route.name === 'Settings') {
            iconName = focused ? 'settings-outline' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.bazaraTint,
        tabBarInactiveTintColor: colors.gray,
        tabBarHideOnKeyboard: true,
      })}>
      <RootBottomTab.Screen name="Store" component={StoreScreen} />
      <RootBottomTab.Screen name="Product" component={Product} />
      <RootBottomTab.Screen name="Order" component={Order} />
      <RootBottomTab.Screen name="Inbox" component={Home} />
      <RootBottomTab.Screen name="Settings" component={Setting} />
    </RootBottomTab.Navigator>
  );
};
