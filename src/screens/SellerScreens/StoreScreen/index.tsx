import React, { useEffect, useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { StatusBar, View, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView, Text } from '../../../components/common';
import { colors } from '../../../utils/themes';
import { globalStyles } from "../../../styles/globalStyles"
import StoreHeader from '../../../components/resuable/StoreHeader';
import ScrollCard from '../../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {colorCart, universityLogo, truckLogo, usersLogo, productLogo} from "../../../assets"
import ListCard from '../../../components/resuable/ListCard';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { filteredStaffs, getPayouts, getPersonalStore, getStaff, myStore, payouts, storeWallet } from '../../../redux/slices/StoreSlice';
import { ArrayType } from '../../../utils/types';
import { hp } from '../../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllOrders, selectedOrders } from '../../../redux/slices/orderSlice';
import { getAllProducts, myProducts } from '../../../redux/slices/productSlice';
import { HomeOnboard } from './homeOnboard';
import { Home } from './home';

export const StoreScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch()
  const myStoreList = useAppSelector(myStore)
  const orders = useAppSelector(selectedOrders)
  const payoutData = useAppSelector(payouts)
  const AllStaffs = useAppSelector(filteredStaffs)
  const myproducts = useAppSelector(myProducts)
  AsyncStorage.setItem('activeId', myStoreList[0]?.id)

  useEffect(() => {
    getInfo()
  }, [])

const getInfo = async () => {
    setLoading(true)
    const id: string = await AsyncStorage.getItem('activeId')
    await dispatch(getPersonalStore())
    await dispatch(storeWallet(id))
    await dispatch(getAllProducts(id))
    await dispatch(getStaff(id))
    await dispatch(getAllOrders())
    await dispatch(getPayouts(id))
    setLoading(false)
}



  if(loading){
    return (
        <SafeAreaView>
            <View style={[globalStyles.rowCenter, {flex: 1}]}>
                <ActivityIndicator size={'small'}/>
            </View>
        </SafeAreaView>
    )
  }

  return (
    <>
    {/* {
      myProducts?.length > 0 && AllStaffs?.length > 0 && payoutData?.length > 0 ?
      <Home/> : <HomeOnboard/>
    } */}
    <Home/>
    </>
  );
};

const styles = StyleSheet.create({
  cart: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  greyColor: {
    color: colors.gray
  },
  rowMargin: {
    marginVertical: 20
  }
});
