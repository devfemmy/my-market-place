import { View } from 'react-native'
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView, Text } from '../common'
import { colors } from '../../utils/themes'
import { hp, wp } from '../../utils/helpers'
import { WalletProps } from '../../interfaces'

import { numberFormat } from '../../utils/helpers';




const ScrollCard: React.FC<WalletProps> = ({ escrow, balance }) => {
    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.activeCard}>
                    <Text text={`₦ ${numberFormat(escrow)}`} fontSize={hp(18)} />

                    <Text text="Expected Earnings" fontSize={hp(15)} style={styles.earningText} />
                    <Text 
                        text={`₦ ${numberFormat(balance)} Store Balance`}   
                        fontSize={hp(15)} style={styles.balanceText} />
                </View>

                <View style={styles.inactiveCard}>
                    <Text text={`₦ ${numberFormat(escrow)}`} fontSize={hp(18)} />
                    <Text text="Expected Earnings" fontSize={hp(15)} style={styles.earningText} />
                    <Text text={`₦ ${numberFormat(balance)} Store Balance`}  fontSize={hp(15)} style={styles.balanceText} />
                </View>
            </ScrollView>
        </View>
    )
}

export default ScrollCard


const styles = StyleSheet.create({
    activeCard: {
        backgroundColor: colors.bazaraTint,
        width: wp(250),
        height: hp(130),
        padding: 20,
        marginTop: 15,
        borderRadius: 10,
    },
    inactiveCard: {
        backgroundColor: colors.black,
        width: wp(250),
        height: hp(130),
        padding: 20,
        marginTop: 15,
        borderRadius: 10,
        marginHorizontal: 10
    },
    earningText: {
        color: colors.white,
        opacity: 0.7
    },
    balanceText: {
        marginTop: 20,
        color: colors.white,
        opacity: 0.7
    }
})