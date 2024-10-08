import { View, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { hp, numberFormat, wp } from '../utils/helpers'
import { globalStyles } from '../styles'
import { Text } from '../components/common'
import MobileHeader from './Containers/MobileHeader';
import firebase from '@react-native-firebase/app';
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { changeOrderStatus, getSellerOrders, orderLoader } from '../redux/slices/orderSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { colors } from '../utils/themes'
import { calendar, pin } from '../assets'
import { Button } from '../components/common/Button'
import { useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import OrderActionModal from '../components/resuable/OrderActionModal'




const OrderDetails = (props: any) => {
    const navigation = props?.navigation
    const dispatch = useAppDispatch()
    const [sellerOrderDetail, setSellerOrderDetail] = useState<any>(null)
    const orderLoaderState = useAppSelector(orderLoader)
    const [loader, setLoader] = useState(false)
    const isFocused = useIsFocused();

    const [action, setAction] = useState('')
    const [orderModalVisible, setOrderModalVisible] = useState(false)
    const [stateLoader, setStateLoader] = useState(false)
    const orderId = props?.route?.params?.params?.id
    const [messageLoader, setMessageLoader] = useState(false)
    const [id, setId] = useState('')


    const statusUpdate = sellerOrderDetail?.status === 'PENDING' ? 'Your order is pending' : sellerOrderDetail?.status === 'PROCESSING' ? 'Your order is been processed' : sellerOrderDetail?.status === 'DISPATCHED' ? 'Your order is being dispatched' : sellerOrderDetail?.status === 'COMPLETED' ? 'Your order has been completed' : sellerOrderDetail?.status === 'CANCELLED' ? 'Sorry, your order was cancelled' : sellerOrderDetail?.status === 'REJECTED' ? 'Sorry, your order was rejected' : null


    useEffect(() => {
        const loadAsyn = async () => {
            var id = await AsyncStorage.getItem('activeId') as string

            setId(id)

        }
        loadAsyn()
    }, [isFocused])


    useEffect(() => {
        setStateLoader(true)
        const loadData = async () => {
            const payload = {
                id,
                orderId
            }
            // await dispatch(resetData())
            await dispatch(getSellerOrders(payload)).then(data => {

                var filter = data?.payload?.find((a: any) => a?.id === orderId)
                setSellerOrderDetail(filter)
                setStateLoader(false)
            })

        }
        loadData()
    }, [orderId, id])

    const handleOrderModalOpen = (item: any) => {
        setOrderModalVisible(true)
        setAction(item)
    }

    const handleOrderModalClose = () => {

        const payload = {
            id,
            orderId
        }
        setOrderModalVisible(false)
        dispatch(getSellerOrders(payload)).then(data => {
            var filter = data?.payload?.find((a: any) => a?.id === orderId)
            setSellerOrderDetail(filter)
        })
    }


    const handleSubmit = async (status: any) => {
        const payload = {
            orderId,
            status,
            // productId: sellerOrderDetail?.productId
        }
        setLoader(true)
        try {
            const resultAction = await dispatch(changeOrderStatus(payload))
            if (changeOrderStatus.fulfilled.match(resultAction)) {

                const payload = {
                    id,
                    orderId
                }
                dispatch(getSellerOrders(payload)).then(data => {
                    var filter = data?.payload?.find((a: any) => a?.id === orderId)
                    setSellerOrderDetail(filter)
                })
                Notifier.showNotification({
                    title: 'Success',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                setLoader(false)
            } else {
                var errMsg = resultAction?.payload as string
                setLoader(false)
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
        catch (e) {
            console.log({ e })
        }
    }

    const messageBuyer = async () => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyCicX4foYtKhhR2A4VObeakIfCVK6mitS8",
                authDomain: "chat-and-messaging-66e6e.firebaseapp.com",
                databaseURL: "https://chat-and-messaging-66e6e-default-rtdb.firebaseio.com",
                projectId: "chat-and-messaging-66e6e",
                storageBucket: "chat-and-messaging-66e6e.appspot.com",
                messagingSenderId: "962853764584",
                appId: "1:962853764584:web:31d3dfa59bc269c8acf85d",
                measurementId: "G-W9TY1FG8D5"
            });
          }
        const payload = {
            message: null,
            createdAt: firestore.FieldValue.serverTimestamp(),
            details: {
                deliveryLocation: sellerOrderDetail?.delivery_information?.street + " " + sellerOrderDetail?.delivery_information?.city + " " + sellerOrderDetail?.delivery_information?.state,
                imageUrl: sellerOrderDetail?.variant_img_url,
                price: sellerOrderDetail?.amount,
                quantity: sellerOrderDetail?.quantity,
                size: sellerOrderDetail?.size,
                slug: sellerOrderDetail?.meta?.product_details?.slug,
                title: sellerOrderDetail?.meta?.product_details?.name,
            },
            receiver: {
                id: sellerOrderDetail?.meta?.buyer_details?.id,
                imageUrl: sellerOrderDetail?.meta?.buyer_details?.img_url,
                name: sellerOrderDetail?.meta?.buyer_details?.first_name
            },
            sender: {
                id: sellerOrderDetail?.store_id,
                name: sellerOrderDetail?.meta?.store_details?.store_name
            }
        }
        
        try {
            setMessageLoader(true)
            const docRef = await firestore()
                .collection('messaging')
                .add(payload)
                .then(() => {
                    setMessageLoader(false)
                    return navigation.navigate('SellerChatBox', {
                        params: {
                            id: sellerOrderDetail?.meta?.buyer_details?.id,
                            storeName: sellerOrderDetail?.meta?.buyer_details?.first_name,
                            storeImage: sellerOrderDetail?.meta?.buyer_details?.img_url
                        }
                    })
                })

        }
        catch (e) {
            setMessageLoader(false)
            console.log({ e })
        }
    }


    if (stateLoader) {
        return <View style={styles.container}>
            <ActivityIndicator />
        </View>
    }



    return (
        <View style={styles.container}>
            <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
                <View>
                    <View>
                        <MobileHeader
                            categoryName={'Order Details'}
                            props={props}
                        />
                        <View>
                            <View style={[styles.tag, { backgroundColor: sellerOrderDetail?.status === 'PENDING' ? colors?.orange : sellerOrderDetail?.status === 'PROCESSING' ? colors?.pink : sellerOrderDetail?.status === 'DISPATCHED' ? colors?.purple : sellerOrderDetail?.status === 'COMPLETED' ? colors?.green : sellerOrderDetail?.status === 'REJECTED' ? colors?.red : sellerOrderDetail?.status === 'CANCELLED' ? colors?.red : 'none' }]}>
                                <Text textAlign='center' style={styles.txt} text={statusUpdate ? statusUpdate : ''} fontSize={hp(14)} />
                            </View>

                            <View style={styles.cont}>
                                <View style={[globalStyles.rowStart, styles.top]}>
                                    <Image source={{ uri: sellerOrderDetail?.variant_img_url }} style={styles.img} />
                                    <View style={styles.minDiv}>
                                        <Text fontWeight='600' text={sellerOrderDetail?.meta?.product_details?.name} fontSize={hp(14)} />
                                        <View style={styles.subdiv}>
                                            <Text fontWeight='600' text={'Size -'} fontSize={hp(13)} />
                                            <Text fontWeight='600' text={sellerOrderDetail?.size ? sellerOrderDetail?.size : 'N/A'} color={colors?.bazaraTint} style={styles.txt2} fontSize={hp(13)} />
                                            <Text fontWeight='600' text={'Color -'} fontSize={hp(13)} />
                                            <Text fontWeight='600' text={sellerOrderDetail?.color ? sellerOrderDetail?.color : 'N/A'} color={colors?.bazaraTint} style={styles.txt2} fontSize={hp(13)} />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.hr}></View>

                                <View style={styles.alignStart}>
                                    <Image source={pin} />
                                    <View style={styles.minDiv}>
                                        <Text fontWeight='600' text={"Receiver's Name"} fontSize={hp(16)} color={colors?.gray} style={styles.txt3} />
                                        <Text fontWeight='600' lineHeight={21} text={sellerOrderDetail?.delivery_information?.receivers_name} fontSize={hp(14)} style={{ textTransform: 'capitalize' }} />
                                    </View>
                                </View>
                                <View style={styles.hr}></View>
                                <View style={styles.alignStart}>
                                    <Image source={calendar} />
                                    <View style={styles.minDiv}>
                                        <Text fontWeight='600' text={"Receiver's Address"} fontSize={hp(16)} color={colors?.gray} style={styles.txt3} />
                                        <Text fontWeight='600' lineHeight={21} text={sellerOrderDetail?.delivery_information?.street + " " + sellerOrderDetail?.delivery_information?.city + " " + sellerOrderDetail?.delivery_information?.state} fontSize={hp(14)} />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.cont}>
                                <View style={[globalStyles.rowBetween, styles.big]}>
                                    <Text text='Items Total' />
                                    <Text
                                        text={`₦${numberFormat(Number(sellerOrderDetail?.amount) || 0)}`}
                                        fontSize={hp(18)}
                                        color={colors.white}
                                        numberOfLines={1}
                                        fontWeight={'600'}
                                        style={{ marginTop: hp(5) }}
                                    />
                                </View>
                                <View style={styles.hr}></View>
                                <View style={[globalStyles.rowBetween, styles.big]}>
                                    <Text text='Quantity' />
                                    <Text
                                        text={sellerOrderDetail?.quantity}
                                        fontSize={hp(18)}
                                        color={colors.white}
                                        numberOfLines={1}
                                        fontWeight={'600'}
                                        style={{ marginTop: hp(5) }}
                                    />
                                </View>
                                <View style={styles.hr}></View>
                                <View style={[globalStyles.rowBetween, styles.big]}>
                                    <Text text='Delivery Fee' />
                                    <Text
                                        text={"N/A"}
                                        fontSize={hp(18)}
                                        color={colors.white}
                                        numberOfLines={1}
                                        fontWeight={'600'}
                                        style={{ marginTop: hp(5) }}
                                    />
                                </View>
                            </View>

                            <View style={styles.cont}>
                                <View style={[globalStyles.rowBetween, styles.big]}>
                                    <Text text='Order ID' />
                                    <Text
                                        text={sellerOrderDetail?.id}
                                        fontSize={hp(18)}
                                        color={colors.white}
                                        numberOfLines={1}
                                        fontWeight={'600'}
                                        style={{ marginTop: hp(5) }}
                                    />
                                </View>
                                <View style={styles.hr}></View>
                                <View style={[globalStyles.rowBetween, styles.big]}>
                                    <Text text='Order Date' />
                                    <Text
                                        text={new Date(sellerOrderDetail?.created_at).toDateString()}
                                        fontSize={hp(18)}
                                        color={colors.white}
                                        numberOfLines={1}
                                        fontWeight={'600'}
                                        style={{ marginTop: hp(5) }}
                                    />
                                </View>
                                <View style={styles.hr}></View>
                                <View style={[globalStyles.rowBetween, styles.big]}>
                                    <Text text='Buyer’s Name' />
                                    <Text
                                        text={sellerOrderDetail?.meta?.buyer_details?.first_name}
                                        fontSize={hp(18)}
                                        color={colors.white}
                                        numberOfLines={1}
                                        fontWeight={'600'}
                                        style={{ marginTop: hp(5) }}
                                    />
                                </View>
                            </View>
                            {
                                sellerOrderDetail?.status === 'PENDING' ?
                                    <Button isLoading={loader} title={"Mark as processing"} onPress={() => handleSubmit('PROCESSING')} />
                                    : sellerOrderDetail?.status === 'PROCESSING' ?
                                        <Button isLoading={loader} title={"Mark as dispatched"} onPress={() => handleSubmit('DISPATCHED')} />
                                        : null
                            }
                            <View style={styles.hr}></View>
                            {
                                sellerOrderDetail?.status === "PENDING" || sellerOrderDetail?.status === 'PROCESSING' ?
                                    <View style={globalStyles.rowBetween}>
                                        <Pressable onPress={messageLoader ? () => { } : () => messageBuyer()}>
                                            <Text text='Message Buyer' fontSize={hp(16)} />
                                        </Pressable>

                                        {
                                            sellerOrderDetail?.status === 'PENDING' ?
                                                <Pressable onPress={() => handleOrderModalOpen('reject')}>
                                                    <View style={styles.cont2}>
                                                        <Text text='Reject Order' color={colors.red} fontSize={hp(16)} />
                                                    </View>
                                                </Pressable>
                                                : sellerOrderDetail?.status === 'PROCESSING' ?
                                                    <Pressable onPress={() => handleOrderModalOpen('cancel')}>
                                                        <View style={styles.cont2}>
                                                            <Text text='Cancel Order' color={colors.red} fontSize={hp(16)} />
                                                        </View>
                                                    </Pressable>
                                                    : null
                                        }
                                    </View>
                                    :
                                    <Pressable onPress={messageLoader ? () => { } : () => messageBuyer()}>
                                        <View style={styles.contdiv}>
                                            {
                                                messageLoader ? <ActivityIndicator /> : <Text text='Message Buyer' textAlign='center' fontSize={hp(16)} />
                                            }
                                        </View>
                                    </Pressable>
                            }
                        </View>

                    </View>
                </View>

                <OrderActionModal
                action={action}
                modalVisible={orderModalVisible}
                setModalVisible={handleOrderModalClose}
                orderId={sellerOrderDetail?.id}
            />
            </ScrollView>


           
        </View>
    )
}

export default OrderDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: hp(10),
        paddingTop: Platform.OS === 'ios' ? hp(20) : hp(15),
        backgroundColor: 'black'
    },
    tag: {
        width: '100%',
        padding: hp(13),
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    txt: {
        textTransform: 'capitalize'
    },
    img: {
        width: wp(60),
        height: hp(60),
        borderRadius: 5
    },
    minDiv: {
        marginLeft: hp(10),
    },
    subdiv: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    top: {
        marginVertical: hp(20)
    },
    alignStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingVertical: hp(15)
    },
    txt2: {
        marginHorizontal: hp(5)
    },
    txt3: {
        marginTop: hp(-5)
    },
    hr: {
        backgroundColor: colors.lightGray,
        width: '100%',
        height: 1
    },
    cont: {
        backgroundColor: colors?.artBoard,
        marginVertical: hp(10),
        paddingHorizontal: hp(10),
        borderRadius: 5
    },
    cont2: {
        marginVertical: hp(10),
        paddingHorizontal: hp(10),
        borderRadius: 5
    },
    big: {
        padding: hp(10)
    },
    contdiv: {
        justifyContent: 'center',
        marginTop: hp(10)
    }
})