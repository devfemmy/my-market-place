import React, { useEffect, useState } from 'react';

import { StatusBar, View, StyleSheet, ScrollView, Image, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, Text } from '../../../../components/common';
import { colors } from '../../../../utils/themes';
import { globalStyles } from "../../../../styles/globalStyles"
import StoreHeader from '../../../../components/resuable/StoreHeader';
import ScrollCard from '../../../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {colorCart, universityLogo, truckLogo, usersLogo, productLogo} from "../../../../assets"
import ListCard from '../../../../components/resuable/ListCard';
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"

import { Input } from '../../../../components/common/TextInput';
import { hp } from '../../../../utils/helpers';
import StaffCard from '../../../../components/resuable/StaffCard';
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { InfoCircle } from '../../../../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStaff, staffsData } from '../../../../redux/slices/StaffSlice';
import MobileHeader from '../../../Containers/MobileHeader';
import { useIsFocused } from "@react-navigation/native";


export const StaffScreen = (props: any): JSX.Element => {

  const [searchValue, setSearchValue] = useState('')
  const staffList = useAppSelector(staffsData)
  const dispatch = useAppDispatch()
  const [id, setId] = useState<any>()
  const [stateLoader, setStateLoader] = useState(false)
  const random = props ? props.route.params.params.random : null
  const isFocused = useIsFocused();


  const filterStaff = staffList?.filter((data: any) => data?.user?.first_name.toLowerCase().includes(searchValue.toLowerCase()) || data?.user?.last_name.toLowerCase().includes(searchValue.toLowerCase()))


 

  useEffect(() => {
    setStateLoader(true)
    const loadData = async () => {
      var ids = await AsyncStorage.getItem('activeId') as string
      setId(ids)
      await dispatch(getStaff(ids))
      setStateLoader(false)
    }
    loadData()
  }, [id, random, isFocused])

  const renderItem = ({item}: any) => (
    <StaffCard item={item}/>
  );

  if(stateLoader){
    return (
        <SafeAreaView>
            <View style={[globalStyles.rowCenter, {flex: 1}]}>
                <ActivityIndicator size={'small'}/>
            </View>
        </SafeAreaView>
    )
  }

  console.log(Error)

  // console.log(AllStaffs)

  if(filterStaff?.length < 1){
    return (
        <SafeAreaView>
            <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
            <Image
                source={InfoCircle}
                style={{width: hp(50), height: hp(50), marginBottom:hp(20)}}
            />
            <Text fontWeight="500" fontSize={hp(14)} text={'Seems something went wrong.'} />
            </View>
        </SafeAreaView>
    )
  }

  return (
    <View style={[styles.container]}>
      <MobileHeader 
        props={props}
        categoryName="All Staff"
      />
      <View style={{paddingHorizontal: hp(15)}}>
        <Input
            label={''}
            placeholder={"Search for staff"}
            // onChangeText={(text) => dispatch(searchStaffs(text))}
            searchInput
            containerStyle={{width: '100%'}}
        />
      </View>
      <FlatList
        data={filterStaff}
        renderItem={renderItem}
        keyExtractor={item => item?._id}
        contentContainerStyle={{paddingBottom: hp(100)}}
        style={{marginBottom: hp(-50)}}
      />
      
      <TouchableOpacity onPress={() => props.navigation.navigate('AddStaff')} style={[globalStyles.floating_button, {bottom: hp(20), right: hp(20)}]}>
            <Entypo name={'plus'} size={hp(35)} style={{color: colors.white}} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: hp(10)
  },
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
  },
  floating: {
    position: 'absolute',
    right: hp(20),
    bottom: hp(20)
  }
});
