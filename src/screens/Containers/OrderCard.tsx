import { Image, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { colors } from '../../utils/themes'
import { hp, numberFormat, wp } from '../../utils/helpers'
import { Text } from '../../components/common'
import { globalStyles } from '../../styles'
import { truncate } from '../../utils/server'

const OrderCard = ({ image, name, size, key, price, receiverName, receiverAddress, color, orderId, status, handleClick }: any) => {
    return (
        <Pressable onPress={handleClick}>
            <View style={styles.cardDiv}>
                <View style={styles.startCard}>
                    <View>
                        <Image source={{ uri: image }} style={styles.img} />

                        <View style={styles.div}>
                            <View style={[styles.textContainer, { backgroundColor: status === 'COMPLETED' ? colors.green : status === 'PENDING' ? colors.orange : status === 'PROCESSING' ? colors.pink : status === 'DISPATCHED' ? colors.purple : colors.red }]}>
                                <Text text={status} fontSize={hp(12)} textAlign='center' />
                            </View>
                        </View>
                    </View>

                    <View style={styles.subdiv}>
                        <Text text={name} fontSize={hp(15)} fontWeight='600' />
                        <View style={globalStyles.rowStart}>
                            <Text text={'Size: '} fontSize={hp(14)} fontWeight='600' />
                            <Text text={size ? size : 'N/A'} fontSize={hp(14)} fontWeight='600' color={colors?.bazaraTint} />
                            <Text text={' | '} fontSize={hp(14)} fontWeight='600' />
                            <Text
                                text={`₦${numberFormat(Number(price) || 0)}`}
                                fontSize={hp(14)}
                                color={colors.accent}
                                numberOfLines={1}
                                fontWeight={'600'}
                            />
                        </View>
                        <View style={globalStyles.rowStart}>
                            <Text text={'Color: '} fontSize={hp(14)} fontWeight='600' />
                            <Text text={color ? color : 'N/A'} fontSize={hp(14)} fontWeight='600' color={colors?.bazaraTint} />
                        </View>
                        <View style={globalStyles.rowStart}>
                            <Text text={`Order ID - ${truncate(orderId, 11)}`} fontSize={hp(14)} fontWeight='600' />
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

export default OrderCard

const styles = StyleSheet.create({
    cardDiv: {
        borderBottomWidth: 1,
        borderColor: colors.lightGray,
        paddingVertical: hp(10)
    },
    startCard: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    img: {
        width: wp(80),
        height: hp(80)
    },
    div: {
        marginTop: hp(-20),
        width: '100%'
    },
    textContainer: {
        width: '100%',
        padding: hp(6)
    },
    txt: {
        textTransform: 'capitalize'
    },
    subdiv: {
        marginLeft: hp(15),
        maxWidth: "80%"
    }
})