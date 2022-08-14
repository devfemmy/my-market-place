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
import { PRODUCTS_DATA } from '../../screens/BuyerScreens/DummyData'

const CategoryCard = ({item}) => {
    const navigation = useNavigation<Nav>();

    return (
        <TouchableOpacity 
        onPress={() => navigation.navigate('Products', {title: firstLetterUppercase(item?.categoryName), data: PRODUCTS_DATA})}
        style={[styles.comp]}>
            <View style={styles.imageCard}>
                <Image source={{uri: item?.imgUrl}} resizeMode='cover' style={styles.imageContainer} />
            </View>
            <View style={{width: wp(160), alignItems: 'flex-start', marginTop: hp(5)}}>
                <Text 
                text={firstLetterUppercase(item?.categoryName)} 
                fontSize={hp(14)}
                color={colors.white}
                textAlign={'center'}
                numberOfLines={1}
                style={{marginTop: hp(5)}}
                />
            </View>
        </TouchableOpacity>
    )
}

export default CategoryCard


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