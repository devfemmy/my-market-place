import { View } from 'react-native'
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView, Text } from '../common'
import { colors } from '../../utils/themes'
import { hp, wp } from '../../utils/helpers'
import { WalletProps } from '../../interfaces'





const ScrollCard:React.FC<WalletProps> = ({escrow, balance}) => {
  return (
    <SafeAreaView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.activeCard}>
                <Text text={`₦ ${escrow}`} fontSize={18} />
                <Text text="Expected Earnings" fontSize={15} style={styles.earningText} />
                <Text text={`₦ ${balance} Store Balance`} fontSize={15} style={styles.balanceText} />
            </View>

            <View style={styles.inactiveCard}>
                <Text text={`₦ ${escrow}`} fontSize={18} />
                <Text text="Expected Earnings" fontSize={15} style={styles.earningText} />
                <Text text={`₦ ${balance} Store Balance`} fontSize={15} style={styles.balanceText} />
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default ScrollCard


const styles = StyleSheet.create({
    activeCard: {
        backgroundColor: colors.bazaraTint,
        width: wp(250),
        height: hp(150),
        padding: 20,
        marginVertical: 0,
        borderRadius: 10,
    },
    inactiveCard: {
        backgroundColor: colors.black,
        width: wp(250),
        height: hp(150),
        padding: 20,
        marginVertical: 0,
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