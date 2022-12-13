import { View, StyleSheet, ScrollView, FlatList, Image, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import StoreHeader from '../components/resuable/StoreHeader'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getStoreBySlug, storeBySlug } from '../redux/slices/CategorySlice'
import { getSellerOrders, sellerOrders } from '../redux/slices/orderSlice'
import { getPayouts, payouts } from '../redux/slices/PayoutSlice'
import { getProduct, products } from '../redux/slices/productSlice'
import { getStaff, staffsData } from '../redux/slices/StaffSlice'
import { getStoreById, storeWallet, storeWalletData } from '../redux/slices/StoreSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { bank, groupUser, productLogo } from '../assets'
import { Text } from '../components/common'
import { hp, numberFormat, wp } from '../utils/helpers'
import ListCard from './Containers/ListCard'
import { colors } from '../utils/themes'
import { globalStyles } from '../styles'
import { LockClosed, LockOpened, Profile, Union } from '../constants/images'
import { BarChart, LineChart } from 'react-native-chart-kit'
import { Select } from '../components/common/SelectInput'
import { useIsFocused } from "@react-navigation/native";
import { activityData, fetchActivityAnalysis, fetchProductAnalysis, fetchStoreAnalysis, fetchStoreSalesAnalysis, fetchViewAnalysis, fetchWalletAnalysis, productAnalysis, storeSales, viewData, walletData } from '../redux/slices/DashboardSlice'
import { truncate } from '../utils/server'


const MyStoreScreen = () => {
  const dispatch = useAppDispatch()
  const storebyIdData = useAppSelector(storeBySlug)
  const isFocused = useIsFocused();
  const sellerOrderList = useAppSelector(sellerOrders)
  const payout = useAppSelector(payouts)
  const productList = useAppSelector(products)
  const staffList = useAppSelector(staffsData)
  const walletInfo = useAppSelector(storeWalletData)
  const [id, setId] = useState('')
  const [activeSlug, setActiveSlug] = useState('')
  const [activeName, setActiveName] = useState('')

  const activityAnalysis = useAppSelector(activityData)

  const [viewAnalysis, setViewAnalysis] = useState<any>()
  const walletAnalysis = useAppSelector(walletData) 
  const [stateLoader, setStateLoader] = useState(false)
  const storeData = useAppSelector(storeSales) as any
  const productData = useAppSelector(productAnalysis) as any
 

  useEffect(() => {
    const loadAsync = async () => {
      var id = await AsyncStorage.getItem('activeId') as string
      var slug = await AsyncStorage.getItem('activeSlug') as string
      var name = await AsyncStorage.getItem('activeName') as string
     
      setId(id)
      setActiveSlug(slug)
      setActiveName(name)
    }
    loadAsync()
  }, [id, isFocused])


  useEffect(() => {
    setStateLoader(true)
    const loadData = async () => {
      var id = await AsyncStorage.getItem('activeId') as string
      
      const payload = {
        id: id,
        status: ''
      }

      dispatch(getSellerOrders(payload))
      dispatch(getStoreById(id))
      dispatch(getStoreBySlug(activeSlug))
      dispatch(getStaff(id))
      dispatch(getPayouts(id))
      dispatch(storeWallet(id))
      dispatch(fetchActivityAnalysis(id))
      dispatch(fetchWalletAnalysis(id))
      dispatch(fetchStoreAnalysis(id))
      dispatch(fetchViewAnalysis(id)).then(dd => setViewAnalysis(dd?.payload))
      dispatch(fetchStoreSalesAnalysis(id))
      dispatch(fetchProductAnalysis(id))
      await dispatch(getProduct(id))
      setStateLoader(false)
    }

    loadData()
  }, [id])

 



const barLabels = productData?.map((data: any) =>  truncate(data?.name, 10));
const barViews = productData?.map((data: any) => data?.views);

const lineLabels = storeData?.map((data: any) => data?.month);
const lineViews = storeData?.map((data: any) => data?.sales);

  const data = {
    labels: lineLabels,
    datasets: [
      {
        data: lineViews
      }
    ]
  }


  const ViewsData = {
    labels: barLabels,
    datasets: [
      {
        data: barViews
      }
    ]
  }

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => colors.bazaraTint,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const chartConfig2 = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => colors.bazaraTint,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const quickActionArray = [
    {
      id: 1,
      title: "Add your first product",
      icon: productLogo,
      route: 'AddProduct',
      isActive: productList?.length > 0 ? true : false
    },
    {
      id: 2,
      title: "Add users / staff to your store",
      icon: groupUser,
      route: 'AddStaff',
      isActive: staffList?.length > 0 ? true : false
    },
    {
      id: 4,
      title: "Add payout bank account",
      icon: bank,
      route: 'Payout',
      isActive: payout?.payouts?.length > 0 ? true : false
    }

  ]


  const AnalyticsData = [
    {
      id: 1,
      title: "Expected Earning",
      value: walletInfo?.escrow_balance,
      icon: LockClosed,
    },
    {
      id: 2,
      title: "Store Balance",
      value: walletInfo?.available_balance,
      icon: LockOpened,
    }

  ]

  const StoreInfoData = [
    {
      id: 1,
      title: "Product",
      value: productList?.length,
      icon: Union,
    },
    {
      id: 2,
      title: "Staff",
      value: staffList?.length,
      icon: Profile,
    }

  ]


  const AnalyticsRender = ({ item }: any) => (
    <View style={styles.analyticsCard}>
      <Image resizeMode='contain' source={item.icon} style={styles.image} />
      <Text text={item.title} fontWeight='300' fontSize={hp(14)} />
      <Text text={`₦ ${numberFormat(item.value)}`} fontWeight='600' fontSize={hp(20)} />
    </View>
  )

  const StoreInfoRender = ({ item }: any) => (
    <View style={styles.storeInfoCard}>
      <View style={globalStyles.rowStart}>
        <Image resizeMode='contain' source={item.icon} style={[styles.miniimage, { tintColor: colors.bazaraTint }]} />
        <Text text={item.title} fontWeight='600' fontSize={hp(18)} style={{ marginLeft: wp(20) }} />
      </View>
      <Text text={item.value} fontWeight='bold' fontSize={hp(30)} />
    </View>
  )


  if (stateLoader) {
    return <View style={styles.container}><ActivityIndicator /></View>
  }



  return (
    <View style={styles.container}>
      <View>
        <StoreHeader name={activeName} slug={storebyIdData?.slug} />
        {
          stateLoader ? null : <ScrollView  showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
            {
              productList?.length < 1 ? <View style={styles.mt}>

                <Text text='Quick Actions' style={styles.txt} fontSize={hp(16)} fontWeight='600' />

                {quickActionArray?.map((data: any) => {
                  return <ListCard key={data?.id} {...data} />
                })
                }
              </View>
                : null
            }
            {
              productList?.length > 0 && <View>
                <View style={styles.analyticsHolder}>
                  <View style={[globalStyles.lowerContainer, { width: wp(280) }]}>
                    <Text text="Analytics" fontWeight='600' fontSize={hp(14)} />
                  </View>
                  {
                    AnalyticsData.map((val) => {
                      return (
                        <AnalyticsRender item={val} />
                      )
                    })
                  }
                </View>
                <FlatList
                  data={StoreInfoData}
                  renderItem={StoreInfoRender}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                <View style={styles.graphHolder}>
                  <View style={[globalStyles.lowerContainer, { width: wp(300) }]}>
                    <Text text="Total Sales" fontWeight='600' fontSize={hp(15)} />
                  </View>
                  <LineChart
                    data={data}
                    width={wp(330)}
                    height={220}
                    chartConfig={chartConfig}
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    bezier
                  />
                </View>
                <View style={styles.graphHolder2}>
                  <View style={[globalStyles.lowerContainer, { width: wp(300) }]}>
                    <Text text="Store Views" fontWeight='600' fontSize={hp(15)} />
                  </View>
                  <BarChart
                    style={styles.graphStyle}
                    data={ViewsData}
                    width={wp(310)}
                    height={hp(400)}
                    withInnerLines={false}
                    chartConfig={chartConfig2}
                    verticalLabelRotation={90}
                  />
                </View>
              </View>
            }
          </ScrollView>
        }

      </View>
    </View>
  )
}

export default MyStoreScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    paddingTop: Platform.OS === 'ios' ? hp(25) : hp(20),
    flex: 1
  },
  mt: {
    marginVertical: hp(35),
    flex: 1,
    height: hp(700)
  },
  txt: {
    marginBottom: hp(10),
  },
  analyticsCard: {
    width: wp(280),
    height: hp(140),
    backgroundColor: colors.primaryBg,
    marginBottom: hp(10),
    alignSelf: 'center',
    borderRadius: hp(5),
    padding: hp(20),
    justifyContent: 'space-between'
  },
  storeInfoCard: {
    width: wp(160),
    height: hp(120),
    backgroundColor: colors.darkBlack,
    marginTop: hp(20),
    marginLeft: wp(20),
    borderRadius: hp(5),
    padding: wp(20),
    justifyContent: 'space-between'
  },
  analyticsHolder: {
    width: '90%',
    paddingVertical: hp(20),
    marginTop: hp(30),
    alignSelf: 'center',
    backgroundColor: colors.darkBlack,
    borderRadius: hp(5)
  },
  graphHolder: {
    width: '90%',
    paddingVertical: hp(20),
    marginTop: hp(30),
    alignSelf: 'center',
    backgroundColor: colors.darkBlack,
    borderRadius: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphHolder2: {
    width: '90%',
    paddingVertical: hp(20),
    marginTop: hp(30),
    alignSelf: 'center',
    backgroundColor: colors.darkBlack,
    borderRadius: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(80)
  },
  image: {
    width: wp(30),
    height: wp(30),
  },
  miniimage: {
    width: wp(25),
    height: wp(25),
  },
  graphStyle: {
    
  }
})