import React, { useEffect } from 'react';

import { StatusBar, View, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView, Text } from '../../../components/common';
import { colors } from '../../../utils/themes';
import { globalStyles } from "../../../styles/globalStyles"
import StoreHeader from '../../../components/resuable/StoreHeader';
import ScrollCard from '../../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {colorCart, universityLogo, truckLogo, usersLogo, productLogo} from "../../../assets"
import ListCard from '../../../components/resuable/ListCard';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { getPersonalStore, myStore } from '../../../redux/slices/StoreSlice';
import { ArrayType } from '../../../utils/types';


export const StaffScreen = (): JSX.Element => {
//   const dispatch = useAppDispatch()
//   const myStoreList = useAppSelector(myStore)


//   useEffect(() => {
//     dispatch(getPersonalStore())
// }, [])

  return (
    <SafeAreaView>
      
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
