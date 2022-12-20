import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getProfile, profileInfo } from '../redux/slices/ProfileSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addToCart, deleteCart, getCarts, updateCart } from '../redux/slices/cartSlice'
import { getAddress, updateAddress } from '../redux/slices/AddressSlice'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { NavigationContainer } from '@react-navigation/native'
import { getStorage, hp, numberFormat, wp } from '../utils/helpers'
import { globalStyles } from '../styles'
import MobileHeader from './Containers/MobileHeader'
import { Text } from '../components/common'
import { colors } from '../utils/themes'
import { carty, deleteIc } from '../assets'
import EmptyState from './Containers/EmptyState'
import { Button } from '../components/common/Button'
import { useIsFocused } from "@react-navigation/native";
import AddToCartModal from './Containers/AddToCartModal'
import { truncate } from '../utils/server'
import Entypo from 'react-native-vector-icons/Entypo'
import { ActivityIndicator } from 'react-native-paper'

const CartScreen = (props: any,) => {
    const [quantity, setQuantity] = useState(0)
    const [visible, setVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const dispatch = useAppDispatch()
    const [addressList, setAddressList] = useState<Array<any>>([])
    const [getUserToken, setGetUserToken] = useState('')
    const [getCartData, setGetCartData] = useState<Array<any>>([])
    const [activeDelivery, setActiveDelivery] = useState<any>()
    const [userData, setUserData] = useState(null);
    const isFocused = useIsFocused();
    const [phoneModalVisible, setPhoneModalVisible] = useState(false)
    const profileData = useAppSelector(profileInfo)
    const [incrementLoader, setIncrementLoader] = useState(false)
    const renderName = props?.route?.params?.params?.renderName
    const [getCartFromStorage, setGetCartFromStorage] = useState<Array<any>>([])
    const [refresh, setRefresh] = useState(false)
    const cartAmountLocal = getCartFromStorage && getCartFromStorage?.map((data: any) => data?.price * data.quantity);
    const cartTotalLocal = cartAmountLocal
        ? cartAmountLocal.length >= 1 && cartAmountLocal?.reduce((a, b) => a + b)
        : 0;

    const cartAmountLive = getCartData && getCartData?.map((data) => data?.amount * data.quantity);
    const cartTotalLive = cartAmountLive?.length > 0
        ? cartAmountLive.length >= 1 && cartAmountLive?.reduce((a, b) => a + b) : 0;

    const [deliveryFeeData, setDeliveryFeeData] = useState(0)
    const [set, setSet] = useState(null)


    const choosenAddress = addressList?.find(ab => ab.default)

    const openVisible = () => {
        setVisible(true)
    }

    const openPhoneVisible = () => {
        setPhoneModalVisible(true)
    }
    const closePhoneVisible = () => {
        setPhoneModalVisible(false)
    }


    const closeVisible = () => {
        setVisible(false)
        dispatch(getAddress()).then((data) => {
            var filterDefault = data?.payload?.find((d: any) => d.default)
            setActiveDelivery(filterDefault)
            setAddressList(data?.payload)
        })
    }


    const openModalVisible = () => {
        setModalVisible(true)
    }



    const closeModalVisible = () => {
        setModalVisible(false)
    }

    const handleAdd = async () => {
        await getCartFromStorage?.map(async data => {
            var res = await dispatch(addToCart(
                {
                    product_id: data?.productId,
                    quantity: data?.quantity,
                    product_variant_id: data?.variantId,
                    product_variant_spec_id: data?.specId,
                }
            ))
            if (addToCart.fulfilled.match(res)) {
                dispatch(getCarts()).then((data) => {
                    setGetCartData(data?.payload)

                })
                dispatch(getAddress()).then((data) => {
                    var filterDefault = data?.payload?.find((d: any) => d.default)
                    setActiveDelivery(filterDefault)
                    setAddressList(data?.payload)
                    closeModalVisible()
                    AsyncStorage.removeItem('checking')
                })
                dispatch(getProfile())
            }
            else {
                var errMsg = res.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            }

            await AsyncStorage.removeItem('cart')
            await AsyncStorage.removeItem('newEntry')
            setRefresh(true)

        })
    }

    const handleDelete = async () => {
        await AsyncStorage.removeItem('cart')
        await AsyncStorage.removeItem('checking')
        setRefresh(true)
        closeModalVisible()
    }


    useEffect(() => {
        const fetchStorage = async () => {
            var token = await AsyncStorage.getItem('token') as string
            var checkToken = await getStorage('token') as string

            var carts = await AsyncStorage.getItem('cart').then((req: any) => JSON.parse(req))
                .then(json => json)
                .catch(error => console.log('error!'));
            setGetUserToken(checkToken)


            setGetCartFromStorage(carts)
        }
        fetchStorage()
    }, [getUserToken, isFocused, refresh, modalVisible])





    const deliveryList =
        getCartData &&
        getCartData?.map((data, i) => {
            return {
                id: data.id,
                name: data?.productDetail?.sidehustle?.brandName,
                sidehustleId: data?.productDetail?.sidehustleId,
                shippingFee: data?.productDetail?.sidehustle?.shippingFees,
                locations: data?.productDetail?.sidehustle?.location,
            };
        });


    const dataDelivery = deliveryList?.filter((value, index) => {
        const _value = JSON.stringify(value?.sidehustleId);
        return index === deliveryList.findIndex(obj => {
            return JSON.stringify(obj?.sidehustleId) === _value;
        });
    });



    const newList =
        dataDelivery && dataDelivery?.map((data) => {
            return {
                id: data.id,
                sidehustleId: data?.sidehustleId,
                name: data?.name,
                shippingFee:
                    data?.locations?.state === activeDelivery?.state
                        ? data?.shippingFee?.withinLocation
                        : data?.shippingFee?.outsideLocation,
                locations: data?.locations,
            };
        });
    const calculatedFee = newList && newList?.map((data) => data?.shippingFee);

    const reducedFee = calculatedFee && calculatedFee?.reduce((a, b) => a + b, 0);




    const increment = async (index: number, quantity: any, data: any) => {
        if (quantity < data?.productQuantity) {
            var newData = getCartFromStorage?.map((aa, i) => {
                if (i === index) {
                    return {
                        name: aa.name,
                        price: aa?.price,
                        productId: aa.productId,
                        productQuantity: aa.productQuantity,
                        quantity: quantity + 1,
                        specId: aa?.specId,
                        variantId: aa?.variantId,
                        variantImg: aa?.variantImg,
                        size: aa?.size,
                    }
                }
                else {
                    return aa
                }
            })
            setUserData(quantity)
            await AsyncStorage.setItem("cart", JSON.stringify(newData));
            setGetCartFromStorage(newData)
        }
        else {
            Notifier.showNotification({
                title: "Quantity in stock exceeded",
                description: '',
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
        }


    }

    const decrement = async (index: number, quantity: any) => {
        if (quantity === 1) {
            return;
        }
        var newData = getCartFromStorage?.map((aa, i) => {
            if (i === index) {
                return {
                    name: aa.name,
                    price: aa?.price,
                    productId: aa.productId,
                    productQuantity: aa.productQuantity,
                    quantity: quantity - 1,
                    specId: aa?.specId,
                    variantId: aa?.variantId,
                    variantImg: aa?.variantImg,
                    size: aa?.size,
                }
            }
            else {
                return aa
            }
        })
        setUserData(quantity)
        await AsyncStorage.setItem("cart", JSON.stringify(newData));
        setGetCartFromStorage(newData)



}



useEffect(() => {
    if (getUserToken) {
        if (getCartFromStorage?.length > 0) {
            openModalVisible()
        }
        else {
            dispatch(getCarts()).then((data) => {
                setGetCartData(data?.payload)
            })
            dispatch(getAddress()).then((data) => {
                var filterDefault = data?.payload?.find((d: any) => d.default)
                setActiveDelivery(filterDefault)
                setAddressList(data?.payload)
            })
            dispatch(getProfile())
        }
    }
    else {

    }

}, [getCartFromStorage, isFocused, refresh, modalVisible])




const removeFromCart = async (index: any) => {
    var newData = getCartFromStorage?.filter((dd, i) => i !== index)
    setUserData(index)
    await AsyncStorage.setItem("cart", JSON.stringify(newData));
    setGetCartFromStorage(newData)

}

const incrementLive = async (index: any, data: any) => {
    const payload = {
        id: data?.id,
        quantity: data?.quantity + 1
    }
    setSet(index)
    setIncrementLoader(true)
    var response = await dispatch(updateCart(payload))
    if (updateCart.fulfilled.match(response)) {
        dispatch(getCarts()).then((data) => {
            setIncrementLoader(false)
            setGetCartData(data?.payload)
        })
    }
    else {
        var errMsg = response?.payload as string
        Notifier.showNotification({
            title: errMsg,
            description: '',
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
                alertType: 'error',
            },
        });
    }
}

const decrementLive = (index: any, data: any) => {
    if (data?.quantity === 1) {
        return;
    }
    const payload = {
        id: data?.id as string,
        quantity: (data?.quantity - 1).toString()
    }
    setSet(index)
    setIncrementLoader(true)

    dispatch(updateCart(payload)).then(() => {
        dispatch(getCarts()).then((data) => {
            setIncrementLoader(false)
            setGetCartData(data?.payload)
        })
    })


}

const removeFromCartLive = (index: any, data: any) => {
    console.log({ data }, "===", data?.id)
    dispatch(deleteCart(data?.id)).then(() => {
        dispatch(getCarts()).then((data) => {
            setGetCartData(data?.payload)
        })
    })

}


const localCheckout = async () => {
    if (!getUserToken) {
        Notifier.showNotification({
            title: 'You need to be logged In',
            description: '',
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
                alertType: 'error',
            },
        });
        await AsyncStorage.setItem('checking', 'true')
        return props.navigation.navigate('LoginScreen')

    }
    else {

    }
}


const DeliveryRoute = () => {
    return props.navigation.navigate('DeliveryScreen', {
        params: {
            amount: cartTotalLive
        }
    })
}


//    const clear = async () => {
//     await AsyncStorage.clear()
//    }


return (
    <View style={[globalStyles.wrapper, { paddingHorizontal: hp(15) }]}>
        <MobileHeader
            props={props}
            categoryName="My Cart"
            myCart
            token={getUserToken}
        />

        {/* LocalStorage */}
        {
            getCartFromStorage?.length > 0 ?
                <View style={styles.container}>
                    <Text text={`${getCartFromStorage?.length} item(s)`} style={styles.txt} />
                    <View style={styles.top}>
                        <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
                            <View>
                                <View>

                                    {
                                        getCartFromStorage?.map((data: any, i: number) => {
                                            return <View style={styles.bord}>
                                                <View style={globalStyles.rowBetween}>
                                                    <View style={[globalStyles.rowStart, { width: '70%' }]}>
                                                        <Image source={{ uri: Array.isArray(data?.variantImg) ? data?.variantImg[0] : data?.variantImg }} style={styles.image} />
                                                        <Text text='' style={{ marginVertical: 0, marginHorizontal: hp(10) }} />
                                                        <View style={styles.algStart}>
                                                            <Text text={truncate(data?.name, 20)} />
                                                            <Text
                                                                text={`₦${numberFormat(Number(data?.price) || 0)}`}
                                                                fontSize={hp(16)}
                                                                color={colors.accent}
                                                                numberOfLines={1}
                                                                fontWeight={'400'}
                                                                style={{ marginTop: hp(5) }}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={[styles.rowDiv]}>
                                                        <Pressable onPress={() => decrement(i, data?.quantity)}>
                                                            <View style={styles.box}>
                                                            <Entypo name={'minus'} size={hp(20)} style={{ color: colors.white }} />
                                                            </View>
                                                        </Pressable>
                                                        <Text text={data?.quantity?.toString()} fontSize={hp(18)} />
                                                        <Pressable onPress={() => increment(i, data?.quantity, data)}>
                                                            <View style={styles.box}>
                                                            <Entypo name={'plus'} size={hp(20)} style={{ color: colors.white }} />
                                                            </View>
                                                        </Pressable>
                                                    </View>

                                                </View>
                                                <Pressable onPress={() => removeFromCart(i)}>
                                                    <View style={[globalStyles.rowStart, styles.bb]}>
                                                        <Image source={deleteIc} style={styles.icon} />
                                                        <Text text='Remove item' color={colors.bazaraTint} fontSize={14} />
                                                    </View>
                                                </Pressable>

                                            </View>
                                        })
                                    }
                                </View>

                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.bottom}>
                        <View style={globalStyles.rowBetween}>
                            <Text text="Sub total" />
                            <Text
                                text={`₦${numberFormat(Number(cartTotalLocal) || 0)}`}
                                fontSize={hp(16)}
                                color={colors.bazaraTint}
                                numberOfLines={1}
                                fontWeight={'600'}
                            />
                        </View>
                        <View style={globalStyles.rowBetween}>
                            <Text text="Total Payment" />
                            <Text
                                text={`₦${numberFormat(Number(cartTotalLocal) || 0)}`}
                                fontSize={hp(16)}
                                color={colors.bazaraTint}
                                numberOfLines={1}
                                fontWeight={'600'}
                            />
                        </View>
                        <View style={styles.btn2}>
                            <Button title='Checkout' onPress={() => localCheckout()} />
                        </View>
                    </View>
                </View>
                : null
        }

        {/* Api */}
        {
            getCartData?.length > 0 ?
                <View style={styles.container}>
                    <Text text={`${getCartData?.length} item(s)`} style={styles.txt} />
                    <View style={styles.top}>
                        <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
                            <View>
                                <View>

                                    {
                                        getCartData?.map((data: any, i: number) => {
                                            return <View style={styles.bord}>
                                                <View style={globalStyles.rowBetween}>
                                                    <View style={[globalStyles.rowStart, { width: '70%' }]}>
                                                        <Image source={{ uri: data?.variant_img_url }} style={styles.image} />
                                                        <Text text='' style={{ marginVertical: 0, marginHorizontal: hp(10) }} />
                                                        <View style={styles.algStart}>
                                                            <Text text={data?.product_details?.name ? truncate(data?.product_details?.name, 20) : "N/A"} />
                                                            <Text
                                                                text={`₦${numberFormat(Number(data?.amount) || 0)}`}
                                                                fontSize={hp(16)}
                                                                color={colors.accent}
                                                                numberOfLines={1}
                                                                fontWeight={'400'}
                                                                style={{ marginTop: hp(5) }}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={[styles.rowDiv]}>
                                                        <Pressable onPress={() => decrementLive(i, data)}>
                                                            <View style={styles.box}>
                                                                <Entypo name={'minus'} size={hp(20)} style={{ color: colors.white }} />
                                                            </View>
                                                        </Pressable>
                                                        {
                                                            incrementLoader && set === i  ? <ActivityIndicator size={15} color='white' /> :  <Text text={data?.quantity?.toString()} fontSize={hp(18)} />
                                                        }
                                                        <Pressable onPress={() => incrementLive(i, data)}>
                                                            <View style={styles.box}>
                                                            <Entypo name={'plus'} size={hp(20)} style={{ color: colors.white }} />
                                                            </View>
                                                        </Pressable>
                                                    </View>

                                                </View>
                                                <Pressable onPress={() => removeFromCartLive(i, data)}>
                                                    <View style={[globalStyles.rowStart, styles.bb]}>
                                                        <Image source={deleteIc} style={styles.icon} />
                                                        <Text text='Remove item' color={colors.bazaraTint} fontSize={14} />
                                                    </View>
                                                </Pressable>

                                            </View>
                                        })
                                    }
                                </View>

                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.bottom}>
                        <View style={globalStyles.rowBetween}>
                            <Text text="Sub total" />
                            <Text
                                text={`₦${numberFormat(Number(cartTotalLive) || 0)}`}
                                fontSize={hp(16)}
                                color={colors.bazaraTint}
                                numberOfLines={1}
                                fontWeight={'600'}
                            />
                        </View>
                        <View style={globalStyles.rowBetween}>
                            <Text text="Delivery fee" />
                            <Text
                                text={`₦${numberFormat(Number(reducedFee) || 0)}`}
                                fontSize={hp(16)}
                                color={colors.bazaraTint}
                                numberOfLines={1}
                                fontWeight={'600'}
                            />
                        </View>
                        <View style={globalStyles.rowBetween}>
                            <Text text="Total Payment" />
                            <Text
                                text={`₦${numberFormat(Number(cartTotalLive) || 0)}`}
                                fontSize={hp(16)}
                                color={colors.bazaraTint}
                                numberOfLines={1}
                                fontWeight={'600'}
                            />
                        </View>
                        <View style={styles.btn2}>
                            <Button title='Proceed' onPress={() => DeliveryRoute()} />
                        </View>
                    </View>
                </View>
                : null
        }
        {/* <Pressable onPress={clear}>
                    <Text text='clear ' />
                </Pressable> */}
        {
            (getCartFromStorage?.length < 1 || getCartFromStorage === undefined || getCartFromStorage === null) && getCartData?.length < 1 && <View style={styles.tgt}>
                <EmptyState
                    icon={carty}
                    title={'No Item In Cart Yet'}
                    header={'Items will appear here once added to cart'}
                />
            </View>
        }


        <AddToCartModal
            visible={modalVisible}
            setVisible={closeModalVisible}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            getCartFromStorage={getCartFromStorage}
        />

    </View>
)
}

export default CartScreen

const styles = StyleSheet.create({
    container: {
        paddingVertical: hp(10),
        flexDirection: 'column',
        flex: 1,
    },
    top: {
        flex: 4,
    },
    bottom: {
        flex: 1,
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        height: hp(180),
        paddingHorizontal: hp(15)
    },
    txt: {
        marginBottom: hp(15)
    },
    imageContainer: {
        width: '100%',
    },
    btn: {
        marginTop: hp(30),
        marginBottom: hp(50),
        height: hp(55),
        width: '110%',
        alignSelf: 'center'
    },
    image: {
        width: wp(60),
        height: hp(60),
        borderRadius: hp(5)
    },
    algStart: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    rowDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: colors.gray,
        borderWidth: 1,
        borderRadius: 5,
        width: wp(100),
        padding: wp(8)
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center'
        // width: wp(50),
        // height:hp(50)
    },
    bord: {
        borderTopWidth: 1,
        borderTopColor: colors.lightwhite,
        paddingVertical: hp(10),
    },
    icon: {
        width: wp(15),
        marginRight: hp(5)
    },
    bb: {
        marginTop: hp(5)
    },
    tgt: {
        flex: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn2: {
        marginVertical: hp(15)
    }
})