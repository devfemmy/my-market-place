import { View, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text } from '../../../../../components/common'
import { globalStyles } from '../../../../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { icons } from '../../../../../utils/constants'
import { useNavigation } from '@react-navigation/native'
import { storeImage, checkbox, bazaraLogo, profile, heart } from '../../../../../assets'
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
import { getWishlist } from '../../../../../redux/slices/Wishlist'
import { getProfile, profileInfo } from '../../../../../redux/slices/ProfileSlice'

const UserHeader = ({ name, image }: any) => {
    const auth = useAppSelector(userState)
    const [token, setToken] = useState<string>()
    const [cartItem, setCartItem] = useState<any>()
    const dispatch = useAppDispatch()
    const cartList = useAppSelector(CartData)
    const [notification, setNotification] = useState<any>()
    const [wishlist, setWishlist] = useState<any>(null)
    const isFocused = useIsFocused();
    const profiles = useAppSelector(profileInfo)

    const buyerNotification = notification?.filter((data: any) => data?.type === "ORDER" && data?.status === "UNREAD")

    



    useEffect(() => {
        if (token) {
            dispatch(getNotifications()).then(dd => setNotification(dd?.payload))
            dispatch(getCarts())
            dispatch(getProfile())
            dispatch(getWishlist()).then(dd => {
                setWishlist(dd?.payload)
            })
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
                        <Image source={{ uri: profiles?.img_url ? profiles?.img_url : "data:image/png;base64,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"  }} resizeMode='cover' style={styles.imageContainer} />
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
                            buyerNotification?.length > 0 && <Badge size={15} style={styles.bg2}>
                                {buyerNotification?.length}
                            </Badge>
                        }
                        <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={styles.iconCard}>
                            <icons.Octicons name="bell-fill" size={hp(25)} color="white" />
                        </TouchableOpacity>
                    </Pressable>
                    <View style={{ marginLeft: hp(20)}} />
                    <Pressable onPress={() => navigation.navigate('Wishlist')}>
                        {
                            wishlist?.length > 0 && <Badge size={15} style={styles.bg2}>
                                {wishlist?.length}
                            </Badge>
                        }
                        <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={styles.iconCard}>
                            {/* <icons.Octicons name="bell-fill" size={hp(25)} color="white" /> */}
                            <Image source={heart} />
                        </TouchableOpacity>
                    </Pressable>
                    <View style={{ marginLeft: hp(20) }} />
                    <View>
                        {
                            cartList?.length > 0 && <Badge size={15} style={styles.bg2}>
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
                                cartItem?.length > 0 && <Badge size={15} style={styles.bg2}>
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
        left: 10,
        top: 0,
        zIndex: 10,
        
    }
})