import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Button, Text, TouchableOpacity, View } from 'react-native'
import { AuthStackNavigator } from '../../navigations/AuthStackNavigator'
import StackNavigation from '../../navigations/StackNavigation'
import TokenStackNavigation from '../../navigations/TokenStackNavigation'
import { useAppSelector } from '../../redux/hooks'
import { userState } from '../../redux/slices/AuthSlice'
import { Home } from '../BuyerScreens'
import HomeScreen from '../HomeScreen'
import { WebView } from 'react-native-webview';

const BodyContaner = () => {
    const [loading, setLoading] = useState(true);
    const auth = useAppSelector(userState)
    const [token, setToken] = useState<string>()


    useEffect(() => {
        setLoading(true)
        const getToken = async () => {
            try {
                var localToken = await AsyncStorage.getItem('token') as string
                if (localToken) {
                    setToken(localToken)
                    setLoading(false)
                }

            }
            catch (e) {
                console.log({ e })
                setLoading(false)
            }
        }

        getToken()

    }, [token])



    return (
     //   <WebView source={{ uri: 'https://staging.bazara.co/' }} />
        <NavigationContainer>
            {/* {
                auth || token ? <TokenStackNavigation /> : <StackNavigation />
            } */}
            <TokenStackNavigation />
        </NavigationContainer>
    )
}

export default BodyContaner