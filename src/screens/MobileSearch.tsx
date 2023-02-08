/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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


const MobileSearch = (props: any) => {
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useAppDispatch()
  const product = props?.route?.params?.params?.search
  const [searchResult, setSearchResult] = useState<any>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchLoader, setSearchLoader] = useState(false)
  const [rate, setRate] = useState(0)
  const [errMessage, setErrMessage] = useState("")

  const handleModalOpen = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  const handleFilterAct = async () => {
    setLoading(true)
    const payload = {
        search: searchValue || product,
        rating: rate
    }
  
    var response = await dispatch(elasticSearch(payload))

    if(elasticSearch.fulfilled.match(response)){
        setSearchResult(response?.payload)
        handleModalClose()
        setLoading(false)
        setErrMessage('')
    }
    else {
        var errMsg = response?.payload as string
        handleModalClose()
        setLoading(false)
        setErrMessage(`No product found for ${searchValue || product} `)
    }
  }

  useEffect(() => {
    setSearchLoader(true)
    const loadSearch = async () => {
        
      const payload = {
        search: searchValue || product
      }
      var response = await dispatch(elasticSearch(payload))
    
      if (elasticSearch.fulfilled.match(response)) {
        setSearchResult(response?.payload)
        setSearchLoader(false)
        setErrMessage('')
      }
      else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var errMsg = response?.payload as string
        setSearchLoader(false)
        setErrMessage(`No product found for ${searchValue || product} `)
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
  }, [searchValue, product])


  return (
    <View style={styles.container}>
      <MobileHeader categoryName={'Product Search'} props={props} />
      <View>
        <Input isFilter handleFilter={() => handleModalOpen()} label={'Search for products'} value={searchValue} onChangeText={(e) => setSearchValue(e)} />
      </View>
      <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {
          (searchResult?.length > 0 && !searchLoader  ) && <FlatGrid
            itemDimension={130}
            data={searchResult}
            spacing={10}
            renderItem={({ item }) => (
              <Search data={item} mini={true} image={item?.product_variants[0]?.img_urls[0]} slug={item?.slug} name={item?.name} amount={item?.product_variants[0]?.product_variant_specs[0].amount} />
            )}
          />

        }
        {
         (errMessage?.length > 0) && <EmptyState2 
          icon={globalSearch}
          header={`No product found for ${searchValue || product} `}
         />
        }
        {/* {
          searchResult?.length < 1 && <>
            <AllCategories navigation={props?.navigation} />
            <TopProducts />
          </>
        } */}

      </ScrollView>

      <FilterModal modalVisible={modalVisible} rate={rate} setRate={setRate} closeModal={handleModalClose} action={() => handleFilterAct()} loading={loading} />
    </View>
  )
}

export default MobileSearch

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(5),
    paddingTop: Platform.OS === 'ios' ? hp(20) : hp(10),
    backgroundColor: 'black',
    flex: 1,
  }
})

