import { View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text } from '../../../../../components/common'
import { globalStyles } from '../../../../../styles'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../../../../utils/themes'
import { hp, wp } from '../../../../../utils/helpers'
import { Nav } from '../../../../../utils/types'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks'
import SubHeader from './subHeader'
import { firstLetterUppercase } from '../../../../../utils/functions'
import { CATEGORIES_DATA, PRODUCTS_DATA } from '../../../DummyData'
import { categoryData, getAllCategories } from '../../../../../redux/slices/CategorySlice'
import { getProfile, profileInfo } from '../../../../../redux/slices/ProfileSlice'
import { buyerProducts, getProductBuyer } from '../../../../../redux/slices/productSlice'
import { truncate } from '../../../../../utils/server'

const AllCategories = () => {
    const navigation = useNavigation<Nav>();

    const dispatch = useAppDispatch()
    const categoryItems = useAppSelector(categoryData)


    useEffect(() => {
        dispatch(getAllCategories())
    }, [])



    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            // onPress={() => navigation.navigate('Products', {title: firstLetterUppercase(item?.item?.categoryName), data: PRODUCTS_DATA})}
            style={styles.itemContainer}>
            <View style={styles.CategoryDiv}>
                <View style={styles.CatDiv}>
                    <Image source={{ uri: item?.img_url }} resizeMode='cover' style={styles.imageContainer} />
                    <Text text={truncate(item?.category, 17)} lineHeight={14} fontSize={hp(13)} textAlign='center' />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.comp]}>
            <SubHeader name={'Categories'} />
            <FlatList
                data={categoryItems}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default AllCategories


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
        width: wp(60),
        height: wp(60),
        borderRadius: 50,
    },
    itemContainer: {
        marginTop: hp(15),
        alignItems: 'center',
        marginRight: hp(15),
    },
    CategoryDiv: {
        marginHorizontal: wp(5)
    },
    CatDiv: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 60,
    }
})