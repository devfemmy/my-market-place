import { View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect} from 'react'
import { SafeAreaView, Text } from '../../components/common'
import { globalStyles } from '../../styles'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../utils/themes'
import { hp, wp } from '../../utils/helpers'
import { Nav } from '../../utils/types'
import { firstLetterUppercase } from '../../utils/functions'
import { numberFormat } from '../../utils/helpers'
import { icons } from '../../utils/constants'

const QtyBtn = ({value, size, onAdd, onMinus}) => {
    // const  { navigate } = useNavigation<Nav>();

    return (
        <View style={[globalStyles.rowStart, styles.comp]}>
            <TouchableOpacity onPress={onMinus}>
                <icons.Entypo name="minus" size={size * 1.2} color={colors.gray} />
            </TouchableOpacity>
            <Text 
                text={value || 0} 
                fontSize={size}
                color={colors.gray}
                fontWeight={'400'}
                textAlign={'center'}
                numberOfLines={1}
                style={{marginHorizontal: hp(10)}}
            /> 
            <TouchableOpacity onPress={onAdd}>
                <icons.Entypo name="plus" size={size * 1.2} color={colors.gray} />
            </TouchableOpacity>
        </View>
    )
}

export default QtyBtn


const styles = StyleSheet.create({
    comp: {
        padding: hp(5),
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 5,
    }
})