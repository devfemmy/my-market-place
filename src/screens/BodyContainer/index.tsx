import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Button, Text, TouchableOpacity, View } from 'react-native'
import { AuthStackNavigator } from '../../navigations/AuthStackNavigator'
import StackNavigation from '../../navigations/StackNavigation'
import { useAppSelector } from '../../redux/hooks'
import { userState } from '../../redux/slices/AuthSlice'
import { Home } from '../BuyerScreens'
import HomeScreen from '../HomeScreen'

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


    const onPressLearnMore = async () => {
        console.log("hello world")
        await AsyncStorage.removeItem('token')

    }

    const onPressLearnMore2 = async () => {
        console.log("hello world 222")
        await AsyncStorage.removeItem('token')
    }


    return (
        // <View>
        //     <Button
        //         onPress={onPressLearnMore}
        //         title="Learn Mores"
        //         color="#841584"
        //         accessibilityLabel="Learn more about this purple button"
        //     />
        //     <TouchableOpacity onPress={onPressLearnMore2}>
        //         <View>
        //             <Text>Hello world</Text>
        //         </View>
        //     </TouchableOpacity>

        // </View>

        <NavigationContainer>
            <StackNavigation />
        </NavigationContainer>
    )
}

export default BodyContaner