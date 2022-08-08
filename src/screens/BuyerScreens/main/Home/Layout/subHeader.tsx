import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView, Text } from '../../../../../components/common'
import { globalStyles } from '../../../../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { icons } from '../../../../../utils/constants'
import { useNavigation } from '@react-navigation/native'
import { storeImage, checkbox } from '../../../../../assets'
import { colors } from '../../../../../utils/themes'
import { hp } from '../../../../../utils/helpers'
import { Nav } from '../../../../../utils/types'


const SubHeader = ({name, onPress}) => {
    const  { navigate } = useNavigation<Nav>();

    return (
        <View style={[styles.comp]}>
            <Text 
            text={`${name}`} 
            fontSize={hp(18)}
            color={colors.white}
            />
            { onPress ?
                <TouchableOpacity onPress={onPress} style={{flexDirection: 'row'}}>
                    <Text 
                    text={`See all `} 
                    fontSize={hp(17)}
                    color={colors.bazaraTint}
                    />
                    <icons.AntDesign name="arrowright" size={20} color={colors.bazaraTint} />
                </TouchableOpacity>
                :
                null
            }
        </View>
    )
}

export default SubHeader


const styles = StyleSheet.create({
    comp: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})