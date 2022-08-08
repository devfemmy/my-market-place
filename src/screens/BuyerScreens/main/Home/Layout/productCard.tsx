import { View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect} from 'react'
import { SafeAreaView, Text } from '../../../../../components/common'
import { globalStyles } from '../../../../../styles'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../../../../utils/themes'
import { hp, wp } from '../../../../../utils/helpers'
import { Nav } from '../../../../../utils/types'
import { firstLetterUppercase } from '../../../../../utils/functions'
import { numberFormat } from '../../../../../utils/helpers'

const ProductCard = ({item}) => {
    const  { navigate } = useNavigation<Nav>();

    return (
        <View style={[styles.comp]}>
            <View style={styles.imageCard}>
                <Image source={{uri: item?.img[0]}} resizeMode='cover' style={styles.imageContainer} />
            </View>
            <View style={{width: wp(150), alignItems: 'flex-start', marginTop: hp(5)}}>
                <Text 
                text={firstLetterUppercase(item?.displayName)} 
                fontSize={hp(14)}
                color={colors.white}
                textAlign={'center'}
                numberOfLines={1}
                style={{marginTop: hp(5)}}
                />
                <Text 
                text={`₦${numberFormat(Number(item?.pricing))}`} 
                fontSize={hp(12)}
                color={colors.dispatched}
                textAlign={'center'}
                numberOfLines={1}
                fontWeight={'600'}
                style={{marginTop: hp(5)}}
                />
            </View>
        </View>
    )
}

export default ProductCard


const styles = StyleSheet.create({
    comp: {
        alignItems: 'center',
        marginTop: hp(20),
        marginRight: wp(15)
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(5),
        width: wp(150),
        height: wp(150),
        backgroundColor: colors.dimBlack,
        overflow: 'hidden'
    },
    imageContainer: {
        width: wp(150),
        height: wp(150)
    },
})