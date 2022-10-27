import React from 'react'
import { createStackNavigator as createNativeStackNavigator } from '@react-navigation/stack';
import { Home } from '../screens/BuyerScreens/main/Home';
import { colors } from '../utils/themes';
import { View } from 'react-native';
import { Text } from '../components/common';
import HomeScreen from '../screens/HomeScreen';
import ProductByCategory from '../screens/ProductByCategory';
import ProductDetail from '../screens/Containers/ProductDetail';


const StackNavigation = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={() => ({
                headerShown: false,
                headerTintColor: colors.white,
                headerShadowVisible: false,
                headerStyle: { backgroundColor: colors.primaryBg }
            })}
        >
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ProductByCategory" component={ProductByCategory} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
        </Stack.Navigator>
    )
}

export default StackNavigation