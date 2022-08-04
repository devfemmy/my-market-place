import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { OrderCardProps } from "../../interfaces"
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../utils/types';
import { Text } from '../common'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { globalStyles } from '../../styles'
import { colors } from '../../utils/themes'
import { hp } from '../../utils/helpers'
import { currencyFormat, statusColor, firstLetterUppercase, copyToClipboard } from '../../utils/functions'

const OrderCard: React.FC<OrderCardProps> = ({ item }) => {
    const navigation = useNavigation<Nav>();
    if(item == null){
        return null
    }
    return (
        <View style={styles.cardContainer}>
            <View style={[globalStyles.rowStart]}>

                <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', {order: item})} style={globalStyles.rowStartNoOverflow}>
                    <Image source={{uri: item?.orderInfo?.variantImg}} style={styles.image} />
                    <View style={[globalStyles.cardStatus, {backgroundColor: statusColor(item?.orderInfo?.status)}]}>
                    <Text
                        text={firstLetterUppercase(item?.orderInfo?.status)}
                        fontWeight={"500"}
                        fontSize={hp(13)}
                        style={styles.text} />
                    </View>
                </TouchableOpacity>
                <View style={styles.detContainer}>
                    <Text text={item?.orderInfo?.name} numberOfLines={1} fontWeight={"600"} fontSize={hp(16)} style={styles.text} />
                    <View style={globalStyles.rowStart}>
                        <Text
                        text={"Size - "}
                        fontWeight={"500"}
                        fontSize={hp(14)}
                        style={styles.text} />
                        <Text
                        text={item?.orderInfo?.size}
                        fontWeight={"500"}
                        fontSize={hp(13)}
                        color={colors.bazaraTint}
                        style={styles.text} />
                        <Text
                        text={"  |  "}
                        fontWeight={"500"}
                        fontSize={hp(20)}
                        color={colors.gray}
                        style={styles.text} />
                        <Text
                        // text={currencyFormat(item?.orderInfo?.price)}
                        text={item?.orderInfo?.price}
                        numberOfLines={1} fontWeight={"700"}
                        fontSize={17}
                        style={styles.text} />
                    </View>
                    <Text
                        text={"Estimated Delivery: " + new Date(item?.deliveryInfo?.expectedDeliveryDate).toDateString()}
                        numberOfLines={1}
                        fontWeight={"400"}
                        color={colors.darkGrey}
                        fontSize={hp(12)}
                        style={styles.text}
                    />
                    <View style={globalStyles.rowStart}>
                        <Text
                            text={"Order ID: " + item?.orderInfo?.orderRef}
                            numberOfLines={1}
                            fontWeight={"500"}
                            color={colors.darkGrey}
                            fontSize={hp(14)}
                            style={styles.text}
                        />
                        <TouchableOpacity onPress={() => copyToClipboard(item?.orderInfo?.orderRef)} style={globalStyles.Horizontalspacing}>
                            <Ionicons name={'ios-copy-outline'} size={hp(16)} style={{color: colors.darkGrey}} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
                
            </View>

            <View style={styles.underline}>
            </View>
        </View>
    )
}

export default OrderCard


const styles = StyleSheet.create({
    image: {
        height: hp(105),
        width: hp(105),
        borderRadius: hp(5),
        marginRight: hp(15),
    },
    cardContainer: {
        flexDirection: 'column',
        paddingVertical: hp(10),
        paddingHorizontal: hp(15)
    },
    underline: {
        borderBottomWidth: 1, 
        borderBottomColor: colors.gray,
        paddingVertical: hp(10)
    },
    text: {
        // marginTop: "-2%"
    },
    detContainer: {
        height: hp(105),
        justifyContent: 'space-between'
    }
})