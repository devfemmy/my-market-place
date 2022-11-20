import { View, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getCurrentDate, hp } from '../utils/helpers'
import MobileHeader from './Containers/MobileHeader'
import { useIsFocused } from "@react-navigation/native";
import { useAppDispatch } from '../redux/hooks';
import { getNotifications } from '../redux/slices/notificationSlice';
import { Text } from '../components/common/Text';
import { colors } from '../utils/themes';
import { Image } from 'react-native-animatable';



const SellerNotificationScreen = ({ navigation }: any) => {

    const [notification, setNotification] = useState<any>()
    const dispatch = useAppDispatch()
    const isFocused = useIsFocused();


    useEffect(() => {
        dispatch(getNotifications()).then(dd => setNotification(dd?.payload))

    }, [isFocused])

    const sellerNotification = notification?.filter((data: any) => data?.type !== "ORDER")

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
                                    <Pressable onPress={() => navigation.navigate('Products')}>
                                        <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, paddingBottom: hp(15) }}>
                                            <Text text={item?.message} fontSize={hp(14)} lineHeight={22} style={{ marginVertical: hp(10) }} />
                                            <Text text={getCurrentDate(item?.created_at)} fontSize={hp(13)} lineHeight={18} color={colors.gray} />
                                        </View>
                                    </Pressable>
                                )
                            }}
                        />
                    </View>
                </View>
            }

            {
                sellerNotification?.length < 1 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text text={'No notification available'} fontSize={hp(24)} lineHeight={22} style={{ marginVertical: hp(10) }} />
                </View>
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