import React from 'react'

import { Image, View, StyleSheet } from "react-native"
import { lock, money, withdraw } from '../../assets'
import { capitalizeSentence, hp, numberFormat } from '../../utils/helpers'
import { Text } from '../common'



function TransactionHistory({ type, amount }: any) {
    return (
        <View style={styles.container}>
            <View style={styles.div}>
                <Image source={type === "RECEIVE" ? withdraw : type === "TRANSFER" ? money : lock} />
                <Text text={capitalizeSentence(type)} style={{marginHorizontal: hp(15)}} />
            </View>
            <Text
            text={`₦${numberFormat(Number(amount) || 0)}`}
            fontSize={hp(16)}
            numberOfLines={1}
            fontWeight={'600'}
          />
          
        </View>
    )
}

export default TransactionHistory


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#454444',
        borderBottomWidth: 1,
        paddingBottom: hp(10),
        paddingTop: hp(10)
    },
    div: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {

    }
})
