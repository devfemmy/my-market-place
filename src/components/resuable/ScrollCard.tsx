import { View } from 'react-native'
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView, Text } from '../common'
import { globalTheme } from '../../utils/themes'
import { hp, wp } from '../../utils/helpers'


const ScrollCard = () => {
  return (
    <SafeAreaView>
        <ScrollView horizontal>
            <View style={styles.activeCard}>
                <Text text="₦ 0.00" fontSize={18} />
                <Text text="Expected Earnings" fontSize={15} style={styles.earningText} />
                <Text text="₦ 0.00 Store Balance" fontSize={15} style={styles.balanceText} />
            </View>

            <View style={styles.inactiveCard}>
                <Text text="₦ 0.00" fontSize={18} />
                <Text text="Expected Earnings" fontSize={15} style={styles.earningText} />
                <Text text="₦ 0.00 Store Balance" fontSize={15} style={styles.balanceText} />
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default ScrollCard


const styles = StyleSheet.create({
    activeCard: {
        backgroundColor: globalTheme.bazaraTint,
        width: wp(250),
        height: hp(150),
        padding: 20,
        marginVertical: 20,
        borderRadius: 10,
    },
    inactiveCard: {
        backgroundColor: globalTheme.black,
        width: wp(250),
        height: hp(150),
        padding: 20,
        marginVertical: 20,
        borderRadius: 10,
        marginHorizontal: 10
    },
    earningText: {
        color: globalTheme.white,
        opacity: 0.7
    },
    balanceText: {
        marginTop: 20,
        color: globalTheme.white,
        opacity: 0.7
    }
})