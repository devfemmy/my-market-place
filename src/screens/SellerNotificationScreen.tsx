import { View, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getCurrentDate, hp } from '../utils/helpers'
import MobileHeader from './Containers/MobileHeader'
import { useIsFocused } from "@react-navigation/native";
import { useAppDispatch } from '../redux/hooks';
import { getNotifications, markAsRead } from '../redux/slices/notificationSlice';
import { Text } from '../components/common/Text';
import { colors } from '../utils/themes';
import { Image } from 'react-native-animatable';
import EmptyState from './Containers/EmptyState';
import { notify } from '../assets';
import moment from 'moment';


const SellerNotificationScreen = ({ navigation }: any) => {

    const [notification, setNotification] = useState<any>()
    const dispatch = useAppDispatch()
    const isFocused = useIsFocused();


    useEffect(() => {
        dispatch(getNotifications()).then(dd => setNotification(dd?.payload))

    }, [isFocused])

    const sellerNotification = notification?.filter((data: any) => data?.isStore)

    const routeNotification = async (item: any) => {
        const payload = {
            notification_id: item?.id
        }
        var response = await dispatch(markAsRead(payload))
        if (markAsRead.fulfilled.match(response)) {
            if (item?.type === "PRODUCT") {
                return navigation.navigate('Products')
            }
            else {
                return navigation.navigate('OrderDetails', {
                    params: {
                        id: parseInt(item?.reference)
                    }
                })
             
            }
        }

    }

    return (
        <View style={styles.container}>
            <MobileHeader
                categoryName='Notification'
                props={navigation}
                cart
            />
            {
                sellerNotification?.length > 0 && <View>

                    <View style={{ marginTop: hp(10) }}>
                        <FlatList
                            data={sellerNotification}
                            keyExtractor={item => item?.id}
                            renderItem={({ item }: any) => {
                                return (
                                    <Pressable onPress={() => routeNotification(item)}>
                                        <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, paddingBottom: hp(15) }}>
                                            <Text text={item?.message} color={item?.status === "UNREAD" ? colors.bazaraTint : colors.gray} fontSize={hp(14)} lineHeight={22} style={{ marginVertical: hp(10) }} />
                                            <Text text={moment(item?.created_at).calendar()} fontSize={hp(10)} lineHeight={18} color={colors.white} />
                                        </View>
                                    </Pressable>
                                )
                            }}
                        />
                    </View>
                </View>
            }

            {
                sellerNotification?.length < 1 && <EmptyState icon={notify} title={'No notification available'} header={'All notifications will appear here once available'} />
            }
        </View>
    )
}

export default SellerNotificationScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        paddingHorizontal: hp(10)
    }
})