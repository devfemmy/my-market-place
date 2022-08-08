import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView, Text } from '../../../components/common'
import NavHeader from '../../../components/resuable/NavHeader'
import { useNavigation } from '@react-navigation/native'
import { Nav } from '../../../utils/types/formModels'
import { hp } from '../../../utils/helpers'
import { styles } from '../AuthStoreSuccessScreen/styles'
import { globalStyles } from '../../../styles/globalStyles'
import { Button } from '../../../components/common/Button';
import { truckLogo, uTruck } from '../../../assets'
import { colors } from '../../../utils/themes'

const DeliveryScreen = () => {
    const navigation = useNavigation<Nav>();

    return (
        <SafeAreaView>
            <View>
                <NavHeader
                    icon='chevron-back-outline'
                    handlePress={() => navigation.goBack()}
                    title="Shipping Fee"
                />
            </View>
            <View style={[styles.container, styles.width80]}>
                <Image
                    source={uTruck}
                />

                <View style={subStyle.sub}>
                    <Text fontWeight="400" fontSize={hp(18)} text="No Delivery Locations Added" />
                </View>
                <Text
                    fontWeight="300"
                    fontSize={hp(15)}
                    lineHeight={hp(25)}
                    style={styles.trucksub}
                    color={colors.gray}
                    textAlign="center"
                    text="All your delivery locations will be listed here"
                />
                <View style={[globalStyles.rowCenter, styles.btnContainer]}>
                    <Button
                        title={'Add Shipping Fees'}
                        onPress={() => navigation.navigate('AddShippingFee')}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default DeliveryScreen

const subStyle = StyleSheet.create({
    sub: {
        marginTop: 20
    }
})