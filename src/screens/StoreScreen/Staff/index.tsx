import React, { useEffect } from 'react';

import { StatusBar, View, StyleSheet, ScrollView, Image, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView, Text } from '../../../components/common';
import { colors } from '../../../utils/themes';
import { globalStyles } from "../../../styles/globalStyles"
import StoreHeader from '../../../components/resuable/StoreHeader';
import ScrollCard from '../../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {colorCart, universityLogo, truckLogo, usersLogo, productLogo} from "../../../assets"
import ListCard from '../../../components/resuable/ListCard';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { getPersonalStore, myStore, getStaff, staffs, loading, filteredStaffs, searchStaffs } from '../../../redux/slices/StoreSlice';
import { ArrayType } from '../../../utils/types';
import { Input } from '../../../components/common/TextInput';
import { hp } from '../../../utils/helpers';
import StaffCard from '../../../components/resuable/StaffCard';

export const StaffScreen = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const myStoreList = useAppSelector(myStore)
  const loader = useAppSelector(loading)
  const AllStaffs = useAppSelector(filteredStaffs)


  useEffect(() => {
    dispatch(getStaff(myStoreList[0]?._id))
  }, [])

  const renderItem = ({item}: any) => (
    <StaffCard item={item}/>
  );

  if(loader){
    return (
        <SafeAreaView>
            <View style={[globalStyles.rowCenter, {flex: 1}]}>
                <ActivityIndicator size={'small'}/>
            </View>
        </SafeAreaView>
    )
  }

  return (
    <View style={[globalStyles.wrapper]}>
      <View style={{paddingHorizontal: hp(15)}}>
        <Input
            label={''}
            placeholder={"Search for staff"}
            onChangeText={(text) => dispatch(searchStaffs(text))}
            searchInput
            containerStyle={{width: '100%'}}
        />
      </View>
      <FlatList
        data={AllStaffs}
        renderItem={renderItem}
        keyExtractor={item => item?._id}
        contentContainerStyle={{paddingBottom: hp(100)}}
        style={{marginBottom: hp(-50)}}
      />
    </View>
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
