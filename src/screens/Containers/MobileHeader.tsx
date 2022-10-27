import { View, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { hp } from '../../utils/helpers'
import { Text } from '../../components/common'

const MobileHeader = ({ props, categoryName }: any) => {
    return (
        <View style={[globalStyles.rowBetween, gbStyle.mdTop]}>
            <Ionicons
                name={'chevron-back-outline'}
                size={30}
                color={'white'}
                onPress={() => props?.navigation.goBack()}
            />
            <Text text={categoryName} fontSize={hp(18)} />
            <View />
        </View>
    )
}

export default MobileHeader

const gbStyle = StyleSheet.create({
    mdTop: {
        paddingVertical: hp(10)
    }
});