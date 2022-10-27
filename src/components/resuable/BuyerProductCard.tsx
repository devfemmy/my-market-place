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

const BuyerProductCard = ({item}: any) => {
    const  { navigate } = useNavigation<Nav>();

    return (
        <View style={[styles.comp]}>
            <TouchableOpacity style={styles.imageCard} onPress={() => navigate("ProductDetail", {
                params: {id: item?.slug}
            })}>
                <Image source={{uri: item?.img_url}} resizeMode='cover' style={styles.imageContainer} />
            </TouchableOpacity>
            <View style={{width: wp(160), alignItems: 'flex-start', marginTop: hp(5)}}>
                <Text 
                text={firstLetterUppercase(item?.name)} 
                fontSize={hp(14)}
                color={colors.white}
                textAlign={'center'}
                numberOfLines={1}
                style={{marginTop: hp(5)}}
                />
                <Text 
                text={`₦${numberFormat(Number(item?.amount) || 0)}`} 
                fontSize={hp(12)}
                color={colors.accent}
                textAlign={'center'}
                numberOfLines={1}
                fontWeight={'600'}
                style={{marginTop: hp(5)}}
                />
            </View>
        </View>
    )
}

export default BuyerProductCard


const styles = StyleSheet.create({
    comp: {
        alignItems: 'center',
        marginTop: hp(20),
        marginHorizontal: wp(10)
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(5),
        width: wp(160),
        height: wp(160),
        backgroundColor: colors.dimBlack,
        overflow: 'hidden'
    },
    imageContainer: {
        width: wp(160),
        height: wp(160)
    },
})