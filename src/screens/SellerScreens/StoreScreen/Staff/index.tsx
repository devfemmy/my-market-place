import React, { useEffect } from 'react';

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
import { getPersonalStore, myStore, getStaff, staffs, loading, filteredStaffs, searchStaffs, error } from '../../../../redux/slices/StoreSlice';
import { ArrayType } from '../../../../utils/types';
import { Input } from '../../../../components/common/TextInput';
import { hp } from '../../../../utils/helpers';
import StaffCard from '../../../../components/resuable/StaffCard';
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { InfoCircle } from '../../../../constants/images';

export const StaffScreen = (): JSX.Element => {

  const {navigate} = useNavigation<Nav>()

  const dispatch = useAppDispatch()
  const myStoreList = useAppSelector(myStore)
  const loader = useAppSelector(loading)
  const Error = useAppSelector(error)
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

  if(Error){
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
      
      <TouchableOpacity onPress={() => navigate('AddStaff')} style={[globalStyles.floating_button, {bottom: hp(20), right: hp(20)}]}>
            <Entypo name={'plus'} size={hp(35)} style={{color: colors.white}} />
      </TouchableOpacity>

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
  },
  floating: {
    position: 'absolute',
    right: hp(20),
    bottom: hp(20)
  }
});
