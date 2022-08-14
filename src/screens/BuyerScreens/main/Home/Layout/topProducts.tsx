import { View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect} from 'react'
import { SafeAreaView, Text } from '../../../../../components/common'
import { globalStyles } from '../../../../../styles'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../../../../utils/themes'
import { hp, wp } from '../../../../../utils/helpers'
import { Nav } from '../../../../../utils/types'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import SubHeader from './subHeader'
import { firstLetterUppercase } from '../../../../../utils/functions'
import { getAllCategories, allCategories, loading } from '../../../../../redux/slices/sideHustleSlice'
import { PRODUCTS_DATA } from '../../../DummyData'
import BuyerProductCard from '../../../../../components/resuable/BuyerProductCard'

const TopProducts = () => {
    const navigation = useNavigation<Nav>();

    const renderItem = ({ item }) => (
        <BuyerProductCard item={item} />
    );

    return (
        <View style={[styles.comp]}>
            <SubHeader name={'Top Selling Products'} onPress={() => navigation.navigate('Products', {title: 'Top Selling Products', data: PRODUCTS_DATA})} />
            <FlatList
                data={PRODUCTS_DATA}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default TopProducts


const styles = StyleSheet.create({
    comp: {
        padding: 15,
        alignItems: 'center',
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: wp(70),
        height: wp(70),
        backgroundColor: colors.dimBlack,
        overflow: 'hidden'
    },
    imageContainer: {
        width: wp(70),
        height: wp(70)
    },
    itemContainer: {
        marginTop: hp(15),
        alignItems: 'center',
        marginRight: hp(15),
    }
})