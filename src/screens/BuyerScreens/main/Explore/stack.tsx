import React from 'react';
import {createStackNavigator as createNativeStackNavigator} from '@react-navigation/stack';
import { ExploreStackParamList } from '../../../../navigations/Buyer/types';
import { colors } from '../../../../utils/themes';
import { hp } from '../../../../utils/helpers';
import { Explore } from '.';
import { Products, Categories } from '../../ComponentPages';

const MainStack = createNativeStackNavigator<ExploreStackParamList>();

export const ExploreStackNavigator = (): JSX.Element => {
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
        name="Explore"
        component={Explore}
        options={() => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="Products"
        component={Products}
        options={() => ({
          headerShown: true,
        })}
      />
      <MainStack.Screen
        name="Categories"
        component={Categories}
        options={() => ({
          headerShown: true,
        })}
      />
    </MainStack.Navigator>
  );
};
