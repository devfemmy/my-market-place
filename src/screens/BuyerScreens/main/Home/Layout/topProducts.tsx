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
import { buyerProducts, getProductBuyer } from '../../../../../redux/slices/productSlice'
import { categoryData } from '../../../../../redux/slices/CategorySlice'

const TopProducts = () => {
    const navigation = useNavigation<Nav>();

    const dispatch = useAppDispatch()
    const categoryItems = useAppSelector(categoryData)
    const buyerProoductList = useAppSelector(buyerProducts)

    useEffect(() => {
        dispatch(getAllCategories())
        dispatch(getProductBuyer())
    }, [])

    const renderItem = ({item}: any) => (
        <BuyerProductCard item={item} />
        
    );

    const filterCategory = categoryItems?.map(bb => {
        var list = buyerProoductList?.filter((aa, i) => aa.category === bb?.category)
        if (list?.length > 0) {
            return {
                category: bb?.category,
                id: bb?.id,
                products: list.concat([""])
            }
        }

    })


    return (
       <View>
        {
            filterCategory?.map((data: any,i: number) => {
                return data?.category && (<View key={i}  style={[styles.comp]}>
                <SubHeader name={`Top Selling Products (${data?.category})`}/>
                <FlatList
                    data={data?.products}
                    renderItem={renderItem}
                    keyExtractor={(item: any) => item?.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>)
            })
        }
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
        backgroundColor: colors.black,
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