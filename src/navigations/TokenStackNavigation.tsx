import React, { useEffect, useState } from 'react'
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BuyerOrderScreen from '../screens/BuyerOrderScreen';
import BuyerSearchScreen from '../screens/BuyerSearchScreen';
import BuyerChatScreen from '../screens/BuyerChatScreen';
import BuyerProfileScreen from '../screens/BuyerProfileScreen';
import CreateStoreScreen from '../screens/CreateStoreScreen';
import { getPersonalStore, myStore } from '../redux/slices/StoreSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Products } from '../screens/SellerScreens/main/Product/Products';
import ProductScreen from '../screens/ProductScreen';
import { Order } from '../screens/SellerScreens/main/Order';
import SellerOrderScreen from '../screens/SellerOrderScreen';
import OrderDetails from '../screens/OrderDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StoreSuccessScreen from '../screens/StoreSuccessScreen';
import AddProducts from '../screens/AddProducts';
import AddProductVariant from '../screens/AddProductVariant';
import AddColorVariant from '../screens/AddColorVariant';
import SellerSettingScreen from '../screens/SellerSettingScreen';
import SellerProductDetail from '../screens/SellerProductDetail';
import ProductDetailEdit from '../screens/ProductDetailEdit';
import ColorEditVariant from '../screens/ColorEditVariant';
import ProductDetailEditVariant from '../screens/ProductDetailEditVariant';
import SellerChatScreen from '../screens/SellerChatScreen';
import EditStore from '../screens/SellerScreens/EditStore';
import AddStaffScreen from '../screens/SellerScreens/StoreScreen/Staff/AddStaff';
import { StaffScreen } from '../screens/SellerScreens';
import Account from '../screens/SellerScreens/StoreScreen/Payout';
import Profile from '../screens/SellerScreens/Profile';
import BuyerOrderDetail from '../screens/BuyerOrderDetail';
import { getStorage } from '../utils/helpers';
import { useIsFocused } from "@react-navigation/native";
import StoreInfo from '../screens/StoreInfo';
import NotificationScreen from '../screens/NotificationScreen';
import SellerNotificationScreen from '../screens/SellerNotificationScreen';

const TokenStackNavigation = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();
    const [store, setStore] = useState('')


    useEffect(() => {

        const loadAsync = async () => {
             var data = await AsyncStorage.getItem('type') || null
             var token = await AsyncStorage.getItem('token') || null
            // console.log({data})
            var cartCheck = await AsyncStorage.getItem('checking') || null
            var userType = await AsyncStorage.getItem('mode') || null
            var response = await dispatch(getPersonalStore())
          
            if (getPersonalStore.fulfilled.match(response)) {

                // if (data) {
                //     setStore('CreateStoreScreen')
                //     setLoading(false)
                // }
                if (cartCheck) {
                    setStore('CartScreen')
                    setLoading(false)
                }
                else if (userType && userType === "Buyer" && token) {
                    setStore('BuyerScreen')
                    setLoading(false)
                }
                else if (userType && userType === "Seller" && token) {
                    setStore('SellerScreen')
                    setLoading(false)
                }
                else if (response?.payload?.length > 0 && token) {
                    setStore('SellerScreen')
                    setLoading(false)
                }
                else if (response?.payload?.length < 1 && token) {
                    setStore('BuyerScreen')
                    setLoading(false)
                }
                else {
                    setStore('Home')
                    setLoading(false)
                }
            }
            else {
                var errMsg = response?.payload as string
                console.log({ errMsg })
                setStore('Home')
                setLoading(false)
            }


        }

        loadAsync()
    }, [store, isFocused])


    const BuyerScreen = () => {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: colors.primaryBg },
                    tabBarStyle: { backgroundColor: colors.primaryBg, borderTopColor: colors.darkBlack },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = '';
                        if (route.name === 'Home') {
                            iconName = focused ? 'ios-home' : 'ios-home-outline';
                        } else if (route.name === 'Explore') {
                            iconName = 'search';
                        } else if (route.name === 'Order') {
                            iconName = focused ? 'cart' : 'cart-outline';
                        }
                        if (route.name === 'Chat') {
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
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Explore" component={BuyerSearchScreen} />
                <Tab.Screen name="Order" component={BuyerOrderScreen} />
                <Tab.Screen name="Chat" component={BuyerChatScreen} />
                <Tab.Screen name="Profile" component={BuyerProfileScreen} />
            </Tab.Navigator>
        );
    }


    const SellerScreen = () => {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    headerTintColor: 'black',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: colors.primaryBg },
                    tabBarStyle: { backgroundColor: colors.primaryBg, borderTopColor: colors.darkBlack },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = '';
                        if (route.name === 'Store') {
                            iconName = focused ? 'ios-home' : 'ios-home-outline';
                        } else if (route.name === 'Products') {
                            iconName = 'search';
                        } else if (route.name === 'Orders') {
                            iconName = focused ? 'cart' : 'cart-outline';
                        }
                        if (route.name === 'Chat') {
                            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                        }
                        if (route.name === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: colors.bazaraTint,
                    tabBarInactiveTintColor: colors.gray,
                    tabBarHideOnKeyboard: true,
                })}
            >
                <Tab.Screen name="Store" component={MyStoreScreen} />
                <Tab.Screen name="Products" component={ProductScreen} />
                <Tab.Screen name="Orders" component={SellerOrderScreen} />
                <Tab.Screen name="Chat" component={SellerChatScreen} />
                <Tab.Screen name="Settings" component={SellerSettingScreen} />

            </Tab.Navigator>
        );
    }


    if (loading) {
        return null;
    }

    return (
        <Stack.Navigator
            initialRouteName={store}
            screenOptions={() => ({
                headerShown: false,
                headerTintColor: colors.white,
                headerShadowVisible: false,
                headerStyle: { backgroundColor: colors.primaryBg }
            })}
        >
            <Stack.Screen name="BuyerScreen" component={BuyerScreen} />
            <Stack.Screen name="CreateStoreScreen" component={CreateStoreScreen} />
            <Stack.Screen name="ProductByCategory" component={ProductByCategory} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name='CartScreen' component={CartScreen} />
            <Stack.Screen name="BuyerSignUpScreen" component={BuyerSignUpScreen} />
            <Stack.Screen name="SellerSignUpScreen" component={SellerSignUpScreen} />
            <Stack.Screen name='SellerScreen' component={SellerScreen} />
            <Stack.Screen name='OrderDetails' component={OrderDetails} />
            <Stack.Screen name='StoreSuccessScreen' component={StoreSuccessScreen} />
            <Stack.Screen name='AddProduct' component={AddProducts} />
            <Stack.Screen name='AddProductVariant' component={AddProductVariant} />
            <Stack.Screen name='AddColorVariant' component={AddColorVariant} />
            <Stack.Screen name='SellerProductDetail' component={SellerProductDetail} />
            <Stack.Screen name='ProductDetailEdit' component={ProductDetailEdit} />
            <Stack.Screen name='ColorEditVariant' component={ColorEditVariant} />
            <Stack.Screen name='ProductDetailEditVariant' component={ProductDetailEditVariant} />
            <Stack.Screen name='EditStore' component={EditStore} />
            <Stack.Screen name='Staffs' component={StaffScreen} />
            <Stack.Screen name='AddStaff' component={AddStaffScreen} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='BuyerOrderDetail' component={BuyerOrderDetail} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name='LoginScreen' component={LoginScreen} />
            <Stack.Screen name='DeliveryScreen' component={DeliveryScreen} />
            <Stack.Screen name='Account' component={Account} />
            <Stack.Screen name='StoreInfo' component={StoreInfo} />
            <Stack.Screen name='Notification' component={NotificationScreen} />
            <Stack.Screen name='SellerNotification' component={SellerNotificationScreen} />
        </Stack.Navigator>
    )
}

export default TokenStackNavigation