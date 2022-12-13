import { View, StyleSheet, ScrollView, Pressable, Image, FlatList, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getBuyerOrders, getSellerOrders } from '../redux/slices/orderSlice'
import { globalStyles } from '../styles'
import { Text } from '../components/common'
import { hp, numberFormat, wp } from '../utils/helpers'
import { Menu, Button, ActivityIndicator } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo'
import { colors } from '../utils/themes'
import { Input } from '../components/common/TextInput'
import EmptyState from './Containers/EmptyState'
import { notify, productLogo } from '../assets'
import OrderCard from './Containers/OrderCard'
import { useIsFocused } from "@react-navigation/native";

const BuyerOrderScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch()
  const [buyerOrderList, setBuyerOrderList] = useState<any>(null)
  const [searchValue, setSearchValue] = useState('')
  const [status, setStatus] = useState("ALL")
  const [stateLoader, setStateLoader] = useState(false)
  const [id, setId] = useState('')
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();

  const filterBuyerData = status === "ALL" ? buyerOrderList : buyerOrderList?.filter((data: any) => data?.status === status)

  useEffect(() => {
    const loadAsyn = async () => {
      var id = await AsyncStorage.getItem('activeId') as string
      setId(id)
    }
    loadAsyn()
  }, [id, isFocused])


  useEffect(() => {
    
    const loadData = async () => {
      setStateLoader(true)
     var response = await dispatch(getBuyerOrders())
     if(getBuyerOrders.fulfilled.match(response)){
       setBuyerOrderList(response?.payload)
        setStateLoader(false)
     }
     else {
      setStateLoader(false)
     }

    }
    loadData()
  }, [id, isFocused])


  const renderList = ({ data }: any) => (
    <Pressable onPress={() => setStatus(data)}>
      <View style={styles.itemDiv}>
        <Text text={data} textAlign='center' fontWeight='700' style={{ textTransform: 'capitalize' }} color={status === data ? colors.bazaraTint : colors.white} />
      </View>
    </Pressable>
  )


  if (stateLoader) {
    return <View style={styles.container}>
      <ActivityIndicator />
    </View>
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={globalStyles.rowBetween}>
          <Text text={`Orders (${filterBuyerData?.length})`} fontSize={hp(18)} fontWeight='600' />
        </View>
        <FlatList
          data={["ALL", "PENDING", "PROCESSING", "DISPATCHED", "CANCELLED", "REJECTED", "COMPLETED"]}
          keyExtractor={item => item}
          renderItem={({ item }: any) => {
            return <Pressable onPress={() => setStatus(item)}>
              <View style={styles.itemDiv}>
                <Text text={item} textAlign='center' fontWeight='700' style={{ textTransform: 'capitalize', textDecorationLine: status === item ? 'underline' : 'none' }} color={status === item ? colors.bazaraTint : colors.white} />
              </View>
            </Pressable>
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        {/* <View>
        <Input label={'Search for orders'} searchInput />
      </View> */}
        
        <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
          {
            filterBuyerData?.length >= 1 && filterBuyerData?.map((data: any, i: number) => {
              return <Pressable onPress={() => navigation.navigate('BuyerOrderDetail', {
                params: {
                  id: data?.id
                }
              })}>
                <View style={styles.contain}>
                  <View style={globalStyles.rowBetween}>
                    <View style={styles.subdiv}>
                      <View style={globalStyles.rowStart}>
                        <Image style={styles.img} source={{ uri: data?.variant_img_url }} />
                        <View style={styles.maldiv}>
                          <Text text={data?.meta?.product_details?.name} fontWeight='600' fontSize={hp(12)} />
                          <View style={globalStyles.rowStart}>
                            <View style={globalStyles.rowStart}>
                              <Text text='Size - ' fontWeight='400' fontSize={hp(10)} />
                              <Text text={data?.size} color={colors.bazaraTint} fontWeight='400' fontSize={hp(10)} style={{ marginLeft: hp(5) }} />
                            </View>
                            <Text
                              text={`₦${numberFormat(Number(data?.amount * data?.quantity))}`}
                              fontSize={hp(14)}
                              color={colors.white}
                              textAlign={'center'}
                              numberOfLines={1}
                              fontWeight={'bold'}
                            />

                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.subdiv2}>
                      <View style={{ backgroundColor: data?.status === "PENDING" ? colors.antdOrange : data?.status === "PROCESSING" ? colors.antdBlue : data?.status === "DISPATCHED" ? colors.antdPurple : data?.status === "CANCELLED" ? colors.antdRed : data?.status === "REJECTED" ? colors.antdRed : colors.antdGreen }}>
                        <Text text={data?.status} style={{ textTransform: 'capitalize' }} color={data?.status === "PENDING" ? colors.antdOrange : data?.status === "PROCESSING" ? colors.antdBlue : data?.status === "DISPATCHED" ? colors.antdPurple : data?.status === "CANCELLED" ? colors.antdRed : data?.status === "REJECTED" ? colors.antdRed : colors.antdGreen} />
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            })

          }

        </ScrollView>
      </View >
      {filterBuyerData?.length < 1 && <EmptyState
          icon={notify}
          title="No Orders Yet"
          header='All your store orders will be listed here'

        />
        }
    </View>
  )
}

export default BuyerOrderScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: hp(10),
    paddingTop: Platform.OS === 'ios' ? hp(20) : hp(15),
  },
  txt: {

  },
  itemDiv: {
    borderRadius: 10,
    padding: hp(10),
    // width: wp(80),
  },
  contain: {
    paddingVertical: hp(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightwhite,
  },
  subdiv: {
    width: '100%'
  },
  img: {
    width: wp(40),
    height: hp(40)
  },
  maldiv: {
    marginLeft: hp(10)
  },
  subdiv2: {

  }
})