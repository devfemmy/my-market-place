import React from 'react'
import { createStackNavigator as createNativeStackNavigator } from '@react-navigation/stack';
import { Home } from '../screens/BuyerScreens/main/Home';
import { colors } from '../utils/themes';
import { View } from 'react-native';
import { Text } from '../components/common';
import HomeScreen from '../screens/HomeScreen';
import ProductByCategory from '../screens/ProductByCategory';
import ProductDetail from '../screens/Containers/ProductDetail';
import CartScreen from '../screens/CartScreen';
import BuyerSignUpScreen from '../screens/BuyerSignUpScreen';
import SellerSignUpScreen from '../screens/SellerSignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import MyStoreScreen from '../screens/MyStoreScreen';



const StackNavigation = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={() => ({
                headerShown: false,
                headerTintColor: colors.white,
                headerShadowVisible: false,
                headerStyle: { backgroundColor: colors.primaryBg }
            })}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ProductByCategory" component={ProductByCategory} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name='CartScreen' component={CartScreen} />
            <Stack.Screen name="BuyerSignUpScreen" component={BuyerSignUpScreen} />
            <Stack.Screen name="SellerSignUpScreen" component={SellerSignUpScreen} />
            <Stack.Screen name='LoginScreen' component={LoginScreen} />
            <Stack.Screen name='DeliveryScreen' component={DeliveryScreen} />
            <Stack.Screen name='MyStoreScreen' component={MyStoreScreen} />
        </Stack.Navigator>
    )
}

export default StackNavigation