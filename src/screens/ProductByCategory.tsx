import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text } from '../components/common'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { categoryData, getAllCategories } from '../redux/slices/CategorySlice'
import { getProductByCategory } from '../redux/slices/productSlice'
import { globalStyles } from '../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { hp, wp } from '../utils/helpers'
import { colors } from '../utils/themes'
import MobileProductContainer from './Containers/MobileProductContainer'
import { FlatGrid } from 'react-native-super-grid';
import MobileHeader from './Containers/MobileHeader'



const ProductByCategory = (props: any, navigation: any) => {

    const dispatch = useAppDispatch()
    const [filteredList, setFilteredList] = useState<Array<any>>()

    const itemType = props?.route?.params?.params?.id

    const categoryItems = useAppSelector(categoryData)
    const categoryName = categoryItems?.find(data => data?.id === itemType)?.category



    useEffect(() => {
        dispatch(getProductByCategory(itemType)).then(data => {
            console.log({ data })
            setFilteredList(data?.payload)
        })
    }, [itemType])

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    var alteredList = filteredList?.filter(a => a?.product_variant_count > 0)

    return (
        <SafeAreaView style={globalStyles.containerWrapper}>
            <MobileHeader categoryName={categoryName} props={props} />
            <ScrollView>
                <View>
                <FlatGrid
            itemDimension={130}
            data={alteredList}
            spacing={10}
            renderItem={({ item }) => (
                <MobileProductContainer data={item} />
            )}
          />
                    {/* {
                        filteredList?.filter(a => a?.product_variant_count > 0).map((data, j) => {
                            return <MobileProductContainer data={data} />
                        })
                    } */}
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default ProductByCategory

const gbStyle = StyleSheet.create({
    mdTop: {
        paddingVertical: hp(10)
    }
});