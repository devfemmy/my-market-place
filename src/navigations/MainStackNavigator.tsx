import React from 'react';
import {createStackNavigator as createNativeStackNavigator} from '@react-navigation/stack';
import {MainStackParamList} from './types';

import { colors } from '../utils/themes';
import {hp} from '../utils/helpers';
import {RootBottomTabNavigator} from './RootBottomTabNavigator';
import {StoreCreation, AddProduct, PublishProduct, OrderDetails, AddStaffScreen, StaffScreen, Account} from '../screens';
import {WelcomeScreen} from '../screens/WelcomeScreen';
import StoreSuccessScreen from '../screens/StoreSuccessScreen';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export const MainStackNavigator = (): JSX.Element => {
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
       <MainStack.Screen
        name="StoreSuccessScreen"
        component={StoreSuccessScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="AddProduct"
        component={AddProduct}
        options={() => ({
          title: 'Product Details',
          headerShown: true,
        })}
      />
      <MainStack.Screen
        name="PublishProduct"
        component={PublishProduct}
        options={() => ({
          title: 'Product Details',
          headerShown: true,
        })}
      />
      <MainStack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={() => ({
          title: 'Order Details',
          headerShown: true,
        })}
      />
      <MainStack.Screen
        name="Staffs"
        component={StaffScreen}
        options={() => ({
          title: 'All Staff',
          headerShown: true,
        })}
      />
      <MainStack.Screen
        name="AddStaff"
        component={AddStaffScreen}
        options={() => ({
          title: 'Add New Staff',
          headerShown: true,
        })}
      />
      <MainStack.Screen
        name="Account"
        component={Account}
        options={() => ({
          title: 'Payout Account',
          headerShown: true,
        })}
      />
    </MainStack.Navigator>
  );
};
