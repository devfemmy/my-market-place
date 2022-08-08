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
import { CATEGORIES_DATA, PRODUCTS_DATA } from '../DummyData'

const AllCategories = () => {
    const  navigation = useNavigation<Nav>();

    const dispatch = useAppDispatch()
    const categories = useAppSelector(allCategories)

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    const renderItem = ({ item }) => (
        <TouchableOpacity
        onPress={() => navigation.navigate('Products', {title: firstLetterUppercase(item?.categoryName), data: PRODUCTS_DATA})}
        style={styles.itemContainer}>
            <View style={styles.imageCard}>
                <Image source={{uri: item?.imgUrl}} resizeMode='cover' style={styles.imageContainer} />
            </View>
            <View style={{width: wp(70), alignItems: 'center', marginTop: hp(5)}}>
                <Text 
                text={firstLetterUppercase(item?.categoryName)} 
                fontSize={hp(13)}
                color={colors.white}
                textAlign={'center'}
                numberOfLines={1}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.comp]}>
            <SubHeader name={'Categories'} onPress={() => navigation.navigate('Categories', {title: 'Bazara Categories', data: CATEGORIES_DATA})} />
            <FlatList
                data={CATEGORIES_DATA}
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
        width: wp(70),
        height: wp(70)
    },
    itemContainer: {
        marginTop: hp(15),
        alignItems: 'center',
        marginRight: hp(15),
    }
})