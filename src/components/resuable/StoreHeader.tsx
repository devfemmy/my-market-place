import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text } from "../common"
import { globalStyles } from '../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { storeImage, checkbox } from "../../assets"
import { colors } from '../../utils/themes'
import { StoreHeaderProps } from '../../interfaces'
import { hp } from '../../utils/helpers'
import { Nav } from '../../utils/types'
import { copyToClipboard } from '../../utils/functions'
import { useAppDispatch } from '../../redux/hooks'
import { getNotifications } from '../../redux/slices/notificationSlice'
import { Badge } from 'react-native-paper'
import config from '../../config/config'


const StoreHeader: React.FC<StoreHeaderProps> = ({ name, slug }) => {
    const { navigate } = useNavigation<Nav>();

    const [notification, setNotification] = useState<any>()
    const dispatch = useAppDispatch()
    const isFocused = useIsFocused();

    const sellerNotification = notification?.filter((data: any) => data?.isStore && data?.status === "UNREAD")


    useEffect(() => {
        dispatch(getNotifications()).then(dd => setNotification(dd?.payload))

    }, [isFocused])

    const link = `${config.url}/store/${slug}`
    return (
        <View style={[globalStyles.container, globalStyles.rowBetween, styles.comp]}>
            <View style={styles.container}>
                <View style={styles.imageCard}>
                    <Image source={storeImage} style={styles.imageContainer} />
                </View>
                <View style={styles.textCard}>
                    <Text text={name} fontSize={hp(14)} style={{ textTransform: 'capitalize' }} />
                    <TouchableOpacity onPress={() => copyToClipboard(link)}>
                        <View style={styles.copyCard}>
                            <Ionicons
                                name={"copy-outline"}
                                size={hp(15)}
                                color={'white'}
                            />
                            <Text text="Copy store link" fontSize={hp(12)} fontWeight='600' style={styles.div} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => navigate('SellerNotification')} style={styles.iconCard}>
                {
                    sellerNotification?.length > 0 && <Badge size={10} style={styles.bg2}></Badge>
                }
                <Ionicons
                    name={'notifications-outline'}
                    size={25}
                    color={'white'}
                />
            </TouchableOpacity>
        </View>
    )
}

export default StoreHeader


const styles = StyleSheet.create({
    comp: {
        paddingTop: hp(15),
    },
    container: {
        flexDirection: 'row'
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: colors.black

    },
    imageContainer: {
        width: 25,
        height: 25
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
        width: hp(120),
    },
    iconCard: {
        height: '100%',
        marginTop: 5
    },
    div: {
        marginLeft: 5
    },
    bg2: {
        position: 'absolute',
        left: 10,
        top: 0,
        zIndex: 10
    }
})