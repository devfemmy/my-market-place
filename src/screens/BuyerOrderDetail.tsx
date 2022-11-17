import { View, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { hp, numberFormat, wp } from '../utils/helpers'
import { globalStyles } from '../styles'
import { Text } from '../components/common'
import MobileHeader from './Containers/MobileHeader'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { changeOrderStatus, getBuyerOrders, getSellerOrders, orderLoader } from '../redux/slices/orderSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { colors } from '../utils/themes'
import { calendar, cancel, pin } from '../assets'
import { Button } from '../components/common/Button'
import RBSheet from "react-native-raw-bottom-sheet";
import { Input } from '../components/common/TextInput'
import { addReview } from '../redux/slices/ReviewSlice'
import StarRating from 'react-native-star-rating';
import { useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import { getProfile, profileInfo } from '../redux/slices/ProfileSlice'


const BuyerOrderDetail = (props: any) => {
    const navigation = props?.navigation
    const refRBSheet = useRef();
    const dispatch = useAppDispatch()
    const orderLoaderState = useAppSelector(orderLoader)
    const [loader, setLoader] = useState(false)
    const [comment, setComment] = useState('')
    const [rate, setRate] = useState<number>(0)
    const [filteredOrder, setFilteredOrder] = useState<any>(null)
    const [action, setAction] = useState('')
    const [orderModalVisible, setOrderModalVisible] = useState(false)
    const [stateLoader, setStateLoader] = useState(false)
    const orderId = props?.route?.params?.params?.id
    const isFocused = useIsFocused();
    const [messageLoader,setMessageLoader] = useState(false)
    const userProfile = useAppSelector(profileInfo)

    const [id, setId] = useState('')
    const statusUpdate = filteredOrder?.status === 'PENDING' ? 'This order is pending' : filteredOrder?.status === 'PROCESSING' ? 'This order is been processed' : filteredOrder?.status === 'DISPATCHED' ? 'This order is been dispatched' : filteredOrder?.status === 'COMPLETED' ? 'This order is completed' : filteredOrder?.status === 'CANCELLED' ? 'This order has been cancelled' : filteredOrder?.status === 'Rejected' ? 'This order has been rejected' : null
    const [ratingModal, setRatingModal] = useState(false)

    const openRatingModal = () => {
        refRBSheet.current.open()
    }

    const closeRatingModal = () => {
        refRBSheet.current.close()
    }

    useEffect(() => {
        dispatch(getProfile())
      }, [])

    useEffect(() => {
        const loadAsyn = async () => {
            var id = await AsyncStorage.getItem('activeId') as string

            setId(id)

        }
        loadAsyn()
    }, [isFocused])


    useEffect(() => {

        const loadData = async () => {
            setStateLoader(true)
            var response = await dispatch(getBuyerOrders())
            if (getBuyerOrders.fulfilled.match(response)) {
                var fitlterOrders = response?.payload.find((dd: any) => dd?.id === orderId)
                setFilteredOrder(fitlterOrders)
                setStateLoader(false)
            }
            else {
                setStateLoader(false)
            }


        }
        loadData()
    }, [id, orderId, isFocused])

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
            setFilteredOrder(filter)
        })
    }


    const handleSubmit = async (status: any) => {
        const payload = {
            orderId,
            status,
            // productId: filteredOrder?.product_id
        }
        setLoader(true)
        try {
            const resultAction = await dispatch(changeOrderStatus(payload))
            if (changeOrderStatus.fulfilled.match(resultAction)) {
                dispatch(getBuyerOrders()).then(data => {
                    var fitlterOrders = data?.payload.find((dd: any) => dd?.id === orderId)
                    setFilteredOrder(fitlterOrders)
                    setStateLoader(false)
                    openRatingModal()
                })
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

    const handleRateSubmit = async () => {
        if (rate < 1) {
            Notifier.showNotification({
                title: 'Please rate this product',
                description: '',
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'error',
                },
            });
            return
        }

        const payload = {
            rating: rate,
            product_id: filteredOrder?.product_id,
            comment: comment
        }

        setLoader(true)
        try {
            var response = await dispatch(addReview(payload))
            if (addReview.fulfilled.match(response)) {
                closeRatingModal()
                setLoader(false)
                setRate(0)
                setComment('')
                Notifier.showNotification({
                    title: 'Rating Successfull',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });

            }
            else {
                var errMsg = response?.payload as string
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



    const messageSeller = async () => {

        try {
            setMessageLoader(true)
            const docRef = await firestore()
            .collection('messaging')
            .add({
              message: null,
              createdAt: firestore.FieldValue.serverTimestamp(),
              details: {
                  deliveryLocation: filteredOrder?.delivery_information?.street + " " + filteredOrder?.delivery_information?.city + " " + filteredOrder?.delivery_information?.state,
                  imageUrl: filteredOrder?.variant_img_url,
                  price: filteredOrder?.amount,
                  quantity: filteredOrder?.quantity,
                  size: filteredOrder?.size,
                  title: filteredOrder?.meta?.product_details?.name,
                  slug: filteredOrder?.meta?.product_details?.slug
              },
              receiver: {
                  id: filteredOrder?.store_id,
                  imageUrl: filteredOrder?.meta?.store_details?.store_img_url,
                  name: filteredOrder?.meta?.store_details?.store_name
              },
              sender: {
                  id: userProfile?.id,
                  name: userProfile?.first_name
              }
            })
            .then(() => {
                setMessageLoader(false)
                return navigation.navigate('ChatBox', {
                    params: {
                        id: filteredOrder?.store_id,
                        storeName: filteredOrder?.meta?.store_details?.store_name,
                        storeImage: filteredOrder?.meta?.store_details?.store_img_url
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
            <MobileHeader
                categoryName={'Order Details'}
                props={props}
            />
            <ScrollView>
                <View>
                    <View>

                        <View>
                            <View style={[styles.tag, { backgroundColor: filteredOrder?.status === 'PENDING' ? colors?.orange : filteredOrder?.status === 'PROCESSING' ? colors?.pink : filteredOrder?.status === 'DISPATCHED' ? colors?.purple : filteredOrder?.status === 'COMPLETED' ? colors?.green : filteredOrder?.status === 'REJECTED' ? colors?.red : filteredOrder?.status === 'CANCELLED' ? colors?.red : 'none' }]}>
                                <Text textAlign='center' style={styles.txt} text={`${statusUpdate}`} fontSize={hp(14)} />
                            </View>

                            <View style={styles.cont}>
                                <View style={[globalStyles.rowStart, styles.top]}>
                                    <Image source={{ uri: filteredOrder?.variant_img_url }} style={styles.img} />
                                    <View style={styles.minDiv}>
                                        <Text fontWeight='600' text={filteredOrder?.meta?.product_details?.name} fontSize={hp(14)} />
                                        <View style={styles.subdiv}>
                                            <Text fontWeight='600' text={'Size -'} fontSize={hp(13)} />
                                            <Text fontWeight='600' text={filteredOrder?.size ? filteredOrder?.size : 'N/A'} color={colors?.bazaraTint} style={styles.txt2} fontSize={hp(13)} />
                                            <Text fontWeight='600' text={'Color -'} fontSize={hp(13)} />
                                            <Text fontWeight='600' text={filteredOrder?.color ? filteredOrder?.color : 'N/A'} color={colors?.bazaraTint} style={styles.txt2} fontSize={hp(13)} />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.hr}></View>

                                <View style={styles.alignStart}>
                                    <Image source={pin} />
                                    <View style={styles.minDiv}>
                                        <Text fontWeight='600' text={"Receiver's Name"} fontSize={hp(16)} color={colors?.gray} style={styles.txt3} />
                                        <Text fontWeight='600' lineHeight={21} text={filteredOrder?.delivery_information?.receivers_name} fontSize={hp(14)} style={{ textTransform: 'capitalize' }} />
                                    </View>
                                </View>
                                <View style={styles.hr}></View>
                                <View style={styles.alignStart}>
                                    <Image source={calendar} />
                                    <View style={styles.minDiv}>
                                        <Text fontWeight='600' text={"Receiver's Address"} fontSize={hp(16)} color={colors?.gray} style={styles.txt3} />
                                        <Text fontWeight='600' lineHeight={21} text={filteredOrder?.delivery_information?.street + " " + filteredOrder?.delivery_information?.city + " " + filteredOrder?.delivery_information?.state} fontSize={hp(14)} />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.cont}>
                                <View style={[globalStyles.rowBetween, styles.big]}>
                                    <Text text='Items Total' />
                                    <Text
                                        text={`₦${numberFormat(Number(filteredOrder?.amount) || 0)}`}
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
                                        text={filteredOrder?.quantity}
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
                                        text={filteredOrder?.id}
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
                                        text={new Date(filteredOrder?.created_at).toDateString()}
                                        fontSize={hp(18)}
                                        color={colors.white}
                                        numberOfLines={1}
                                        fontWeight={'600'}
                                        style={{ marginTop: hp(5) }}
                                    />
                                </View>
                                <View style={styles.hr}></View>
                                <View style={[globalStyles.rowBetween, styles.big]}>
                                    <Text text='Store Name' />
                                    <Text
                                        text={filteredOrder?.meta?.store_details?.store_name}
                                        fontSize={hp(18)}
                                        color={colors.white}
                                        numberOfLines={1}
                                        fontWeight={'600'}
                                        style={{ marginTop: hp(5) }}
                                    />
                                </View>
                            </View>
                            {
                                filteredOrder?.status === 'DISPATCHED' ?
                                    <Button isLoading={loader} title={"Mark as Completed"} onPress={() => handleSubmit('COMPLETED')} /> : null
                            }
                            <View style={styles.hr}></View>
                            <Pressable onPress={() => messageSeller()}>
                                <View style={styles.contdiv}>
                                  {
                                    messageLoader ? <ActivityIndicator /> : <Text text='Message Seller' textAlign='center' fontSize={hp(16)} />
                                  }  
                                </View>
                            </Pressable>

                        </View>

                    </View>

                </View>
            </ScrollView>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={400}
                animationType='slide'
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: colors.bazaraTint
                    },
                    container: {
                        backgroundColor: 'black',
                        height: hp(400)
                    }
                }}
            >
                <View style={styles.sheet}>
                    <View style={[globalStyles.rowBetween]}>
                        <Text text='Rate Product' fontSize={hp(18)} fontWeight='600' />
                        <Pressable onPress={closeRatingModal}>
                            <View>
                                <Image source={cancel} />
                            </View>
                        </Pressable>
                    </View>

                    <View style={styles.columnContainer2}>
                        <Text text='How would you rate this item?' style={{ marginVertical: hp(10) }} fontSize={hp(14)} fontWeight='400' />
                        <View style={styles.div2}>
                            <StarRating
                                maxStars={5}
                                starSize={35}
                                rating={rate || 0}
                                fullStarColor={colors.bazaraTint}
                                selectedStar={(rating) => setRate(rating)}
                            />
                        </View>

                        <Text text='Comment' fontSize={hp(14)} fontWeight='400' />
                        <Input
                            label={'Comment'}
                            value={comment}
                            multiline={true}
                            numberOfLines={4}
                            onBlur={(e: any) => setComment(e)}
                            onChangeText={(e: any) => setComment(e)}

                        />
                        <Button isLoading={loader} title={"Rate"} onPress={() => handleRateSubmit()} />



                    </View>

                </View>
            </RBSheet>
        </View>
    )
}

export default BuyerOrderDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp(10),
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
    },
    sheet: {
        backgroundColor: 'black'
    },
    columnContainer2: {
        padding: hp(10)
    },
    div2: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp(10)
    }
})