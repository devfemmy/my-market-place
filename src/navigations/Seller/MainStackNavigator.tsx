import React from 'react';
import {createStackNavigator as createNativeStackNavigator} from '@react-navigation/stack';
import {MainStackParamList} from './types';

import { colors } from '../../utils/themes';
import {hp} from '../../utils/helpers';
import {SellerRootBottomTabNavigator} from './RootBottomTabNavigator';
import {StoreCreation, AddProduct, PublishProduct, 
  OrderDetails, AddStaffScreen, StaffScreen, Account, 
  NotificationScreen, NotificationDetails, Reviews, AllReviews} from '../../screens/SellerScreens';
import {WelcomeScreen} from '../../screens/SellerScreens/WelcomeScreen';
import StoreSuccessScreen from '../../screens/SellerScreens/StoreSuccessScreen';
import AuthStoreSuccessScreen from '../../screens/SellerScreens/AuthStoreSuccessScreen';
import EditStore from '../../screens/SellerScreens/EditStore';
import DeliveryScreen from '../../screens/SellerScreens/DeliveryScreen';
import AddShippingFee from '../../screens/SellerScreens/AddShippingFee';
import AuthStoreCreationScreen from '../../screens/SellerScreens/AuthStoreCreationScreen';
import Profile from '../../screens/SellerScreens/Profile';


const MainStack = createNativeStackNavigator<MainStackParamList>();

export const SellerMainStackNavigator = (): JSX.Element => {
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
        component={SellerRootBottomTabNavigator}
        options={() => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="Profile"
        component={Profile}
        options={() => ({
          headerShown: true,
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
          title: 'Payments',
          headerShown: true,})}
        />

      <MainStack.Screen
        name="Reviews"
        component={Reviews}
        options={() => ({
          title: 'Ratings and Reviews',
          headerShown: true,})}
        />

      <MainStack.Screen
        name="AllReviews"
        component={AllReviews}
        options={() => ({
          title: 'Ratings and Reviews',
          headerShown: true})}
        />

        <MainStack.Screen
        name="AuthStoreCreationScreen"
        component={AuthStoreCreationScreen}
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
        name="AuthStoreSuccessScreen"
        component={AuthStoreSuccessScreen}
        options={() => ({
          headerShown: false,
        })}
      />
       <MainStack.Screen
        name="EditStore"
        component={EditStore}
        options={() => ({
          headerShown: false,
        })}
      />
       <MainStack.Screen
        name="DeliveryScreen"
        component={DeliveryScreen}
        options={() => ({
          headerShown: false,
        })}
      />
       <MainStack.Screen
        name="AddShippingFee"
        component={AddShippingFee}
        options={() => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={() => ({
          title: 'Notification',
          headerShown: true,
        })}
      />
      <MainStack.Screen
        name="NotificationDetails"
        component={NotificationDetails}
        options={() => ({
          title: '',
          headerShown: true,
        })}
      />
    </MainStack.Navigator>
  );
};
