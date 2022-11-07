import { View, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text } from '../../../../../components/common'
import { globalStyles } from '../../../../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { icons } from '../../../../../utils/constants'
import { useNavigation } from '@react-navigation/native'
import { storeImage, checkbox, bazaraLogo, profile } from '../../../../../assets'
import { colors } from '../../../../../utils/themes'
import { hp, wp } from '../../../../../utils/helpers'
import { Nav } from '../../../../../utils/types'
import { copyToClipboard } from '../../../../../utils/functions'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import { userState } from '../../../../../redux/slices/AuthSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Badge } from 'react-native-paper';
import { getNotifications } from '../../../../../redux/slices/notificationSlice'
import { CartData, getCarts } from '../../../../../redux/slices/cartSlice'
import { useIsFocused } from "@react-navigation/native";

const UserHeader = ({ name, image }: any) => {
    const auth = useAppSelector(userState)
    const [token, setToken] = useState<string>()
    const [cartItem, setCartItem] = useState<any>()
    const dispatch = useAppDispatch()
    const cartList = useAppSelector(CartData)
    const [notification, setNotification] = useState<any>()

    const isFocused = useIsFocused();


    useEffect(() => {
        if (token) {
            dispatch(getNotifications()).then(dd => setNotification(dd?.payload))
            dispatch(getCarts())
        }

    }, [token, isFocused])


    useEffect(() => {
        const getToken = async () => {
            try {
                var localToken = await AsyncStorage.getItem('token') as string
                var carts = await AsyncStorage.getItem('cart').then((req: any) => JSON.parse(req))
                    .then(json => json)
                    .catch(error => console.log('error!')) || [];

                setCartItem(carts)
                if (localToken) {
                    setToken(localToken)
                }

            }
            catch (e) {
                console.log({ e })
            }
        }

        getToken()

    }, [token, isFocused])
    const navigation = useNavigation<Nav>();

    console.log({ token, isFocused, auth })

    return (
        <View style={[styles.comp]}>
            {
                auth || token ? <View style={styles.container}>
                    <View style={styles.imageCard}>
                        <Image source={{ uri: image }} resizeMode='cover' style={styles.imageContainer} />
                    </View>
                    <View style={styles.textCard}>
                        <Text
                            text={` Hi, ${name} 👋`}
                            fontSize={hp(20)}
                            color={colors.gray}
                        />
                    </View>
                </View> : <View>
                    <Image source={bazaraLogo} />
                </View>
            }

            {
                auth || token ? <View style={globalStyles.rowAround}>
                    <Pressable onPress={() => navigation.navigate('Notification')}>
                        {
                            notification?.length > 0 && <Badge style={styles.bg2}>
                                {notification?.length}
                            </Badge>
                        }
                        <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={styles.iconCard}>
                            <icons.Octicons name="bell-fill" size={hp(25)} color="white" />
                        </TouchableOpacity>
                    </Pressable>
                    <View style={{ marginLeft: hp(30) }} />
                    <View>
                        {
                            cartList?.length > 0 && <Badge style={styles.bg2}>
                                {cartList?.length}
                            </Badge>
                        }
                        <TouchableOpacity onPress={() => navigation.navigate('CartScreen', {
                            params: {
                                renderName: 'none'
                            }
                        })} style={styles.iconCard}>
                            <icons.Ionicons name="ios-cart" size={hp(31)} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>
                    :
                    <View style={globalStyles.rowAround}>
                        <View style={styles.bg}>
                            {
                                cartItem?.length > 0 && <Badge style={styles.bg2}>
                                    {cartItem?.length}
                                </Badge>
                            }
                            <TouchableOpacity onPress={() => navigation.navigate('CartScreen', {
                                params: {
                                    renderName: 'none'
                                }
                            })} style={styles.iconCard}>
                                <icons.Ionicons name="ios-cart" size={hp(31)} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: hp(30) }} />
                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.iconCard}>
                            {/* <icons.Octicons name="bell-fill" size={hp(25)} color="white" /> */}
                            <Image source={profile} resizeMode='contain' style={styles.logoImage} />
                        </TouchableOpacity>
                    </View>
            }
        </View>
    )
}

export default UserHeader


const styles = StyleSheet.create({
    comp: {
        padding: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 40,
        height: 40,
        backgroundColor: colors.black,
        overflow: 'hidden'
    },
    imageContainer: {
        width: 40,
        height: 40
    },
    textCard: {
        marginLeft: 10,
    },
    copyCard: {
        flexDirection: 'row',
        backgroundColor: colors.black,
        padding: 5,
        marginTop: 3,
        borderRadius: 5,
        width: 110,
    },
    iconCard: {
    },
    div: {
        marginLeft: 5
    },
    logoImage: {
        width: wp(30),
        height: hp(30),

    },
    bg: {

    },
    bg2: {
        position: 'absolute',
        left: 20,
        top: 0,
        zIndex: 10
    }
})