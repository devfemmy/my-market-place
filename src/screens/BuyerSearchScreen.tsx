import { View, StyleSheet, ScrollView, Platform } from 'react-native'
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
import EmptyState2 from '../components/common/EmptyState'
import { globalSearch } from '../assets'
import FilterModal from '../components/FilterModal/FilterModal'


const BuyerSearchScreen = (props: any) => {
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useAppDispatch()

  const [searchResult, setSearchResult] = useState<any>([])
    const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rate, setRate] = useState(0)

  const handleModalOpen = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  const handleFilterAct = async () => {
    setLoading(true)
    const payload = {
        search: searchValue,
        rating: rate
    }
    var response = await dispatch(elasticSearch(payload))
    if(elasticSearch.fulfilled.match(response)){
        setSearchResult(response?.payload)
        handleModalClose()
        setLoading(false)
    }
    else {
        var errMsg = response?.payload as string
        handleModalClose()
        setLoading(false)
    }
  }


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
        <Input  label={'Search top selling products'} value={searchValue} onChangeText={(e) => setSearchValue(e)} isFilter handleFilter={() => handleModalOpen()} />
      </View>
      <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
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
         (searchValue?.length > 0 && searchResult?.length < 1) && <EmptyState2 
          icon={globalSearch}
          header={`No product found for ${searchValue} `}
         />
        }
        {
          searchValue?.length < 1 && <>
            <AllCategories navigation={props?.navigation} />
            <TopProducts />
          </>
        }

      </ScrollView>

        <FilterModal modalVisible={modalVisible} rate={rate} setRate={setRate} closeModal={handleModalClose} action={() => handleFilterAct()} loading={loading} />
    </View>
  )
}

export default BuyerSearchScreen

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(5),
    paddingTop: Platform.OS === 'ios' ? hp(20) : hp(10),
    backgroundColor: 'black',
    flex: 1,
  }
})

