import React, { useEffect } from 'react';

import { StatusBar, View, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView, Text } from '../../components/common';
import { colors } from '../../utils/themes';
import { globalStyles } from "../../styles/globalStyles"
import StoreHeader from '../../components/resuable/StoreHeader';
import ScrollCard from '../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {colorCart, universityLogo, truckLogo, usersLogo, productLogo} from "../../assets"
import ListCard from '../../components/resuable/ListCard';
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { getPersonalStore, myStore } from '../../redux/slices/StoreSlice';
import { ArrayType } from '../../utils/types';
import { hp } from '../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const StoreScreen = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const myStoreList = useAppSelector(myStore)

  AsyncStorage.setItem('activeId', myStoreList[0]?.id)

  useEffect(() => {
    dispatch(getPersonalStore())
}, [])

  const quickActionArray = [
     {
      id: 1,
      title: "Add your first product",
      icon: productLogo,
      route: 'Product'
     },
     {
      id: 2,
      title: "Add users / staff to your store",
      icon: usersLogo,
      route: ''
     },
     {
      id: 3,
      title: "Set delivery or shipping fee",
      icon: truckLogo,
      route: 'DeliveryScreen'
     },
     {
      id: 4,
      title: "Add payout bank account",
      icon: universityLogo,
      route: ''
     }

  ]

  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>
        <StoreHeader name={myStoreList[0]?.brandName} />
        <View style={[globalStyles.container]}>
          <ScrollCard escrow={myStoreList[0]?.wallet?.escrow} balance={myStoreList[0]?.wallet?.balance} />
          <View style={[globalStyles.rowBetweenNoCenter, styles.rowMargin]}>
            <View style={globalStyles.rowStart}>
              <Image source={colorCart} style={styles.cart} />
              <Text text="Order" />
            </View>
            <View style={globalStyles.rowStart}>
              <Text text="100" style={styles.greyColor} />
              <Ionicons
                name={"chevron-forward-outline"}
                size={15}
                color={'grey'}
              />
            </View>
          </View>

          <Text text="Quick Actions" fontSize={hp(18)} style={styles.rowMargin} />

          <View>
          {
            quickActionArray?.map((data: ArrayType) => {
              return <ListCard key={data?.id} {...data} />
            })
          }
          </View>
        

        </View>
      </ScrollView>
    </SafeAreaView>
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
