import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Text } from './Text'
import { bank } from '../../assets'
import { hp, wp } from '../../utils/helpers'

const EmptyState2 = ({icon, header}: any) => {
    return (
        <View>
            <View style={styles.carddiv}>
                <Image
                    source={icon}
                    style={styles.img3}
                />
                <Text text={header} fontSize={hp(16)} fontWeight='600' textAlign='center' />
            </View>
        </View>
    )
}

export default EmptyState2


const styles = StyleSheet.create({
    carddiv: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    img3: {
        width: wp(70),
        height: hp(70)
    },
})