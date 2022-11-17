import { View, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { hp } from '../utils/helpers'
import MobileHeader from './Containers/MobileHeader'
import AllCategories from './BuyerScreens/main/Home/Layout/allCategories'
import TopProducts from './BuyerScreens/main/Home/Layout/topProducts'
import { Input } from '../components/common/TextInput'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { categoryData, getAllCategories } from '../redux/slices/CategorySlice'
import { buyerProducts, elasticSearch, getProductBuyer } from '../redux/slices/productSlice'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { FlatGrid } from 'react-native-super-grid';
import Search from '../components/Search'


const BuyerSearchScreen = (props: any) => {
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useAppDispatch()

  const [searchResult, setSearchResult] = useState<any>()


  useEffect(() => {
    const loadSearch = async () => {
      const payload = {
        search: searchValue
      }
      var response = await dispatch(elasticSearch(payload))
      if (elasticSearch.fulfilled.match(response)) {
        setSearchResult(response?.payload)
      }
      else {
        var errMsg = response?.payload as string
        // Notifier.showNotification({
        //   title: errMsg,
        //   description: '',
        //   Component: NotifierComponents.Alert,
        //   hideOnPress: false,
        //   componentProps: {
        //     alertType: 'error',
        //   },
        // });
      }
    }
    loadSearch()
  }, [searchValue])



  return (
    <View style={styles.container}>
      <MobileHeader categoryName={'Explore'} props={props} />
      <View>
        <Input searchInput label={'Search top selling products'} value={searchValue} onChangeText={(e) => setSearchValue(e)} />
      </View>
      <ScrollView>
        {
          searchValue?.length > 0 && <FlatGrid
            itemDimension={130}
            data={searchResult}
            spacing={10}
            renderItem={({ item }) => (
              <Search data={item} mini={true} image={item?.product_variants[0]?.img_urls[0]} slug={item?.slug} name={item?.name} amount={item?.product_variants[0]?.product_variant_specs[0].amount} />
            )}
          />

        }
        {
          searchValue?.length < 1 && <>
            <AllCategories navigation={props?.navigation} />
            <TopProducts />
          </>
        }

      </ScrollView>
    </View>
  )
}

export default BuyerSearchScreen

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(10),
    paddingVertical: hp(10),
    backgroundColor: 'black',
    flex: 1,
  }
})

