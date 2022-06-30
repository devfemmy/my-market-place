import React, {useState, useEffect} from 'react';

import {StatusBar, View, StyleSheet, ScrollView, ActivityIndicator, FlatList} from 'react-native';
import {SafeAreaView, Text} from '../../components/common';
import { colors } from '../../utils/themes';
import { InfoCircle, Danger, Union, Cash, TickSquare, Chat } from '../../constants/images';
import { useNavigation} from '@react-navigation/native';
import {Button} from '../../components/common/Button';
import {hp, wp} from '../../utils/helpers';
import {globalStyles} from "../../styles/globalStyles"
import { Nav } from '../../utils/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { notifications, loading, getUserNotifications } from '../../redux/slices/userSilce';
import NotificationCard from '../../components/resuable/NotificationCard';

export const NotificationScreen = (): JSX.Element => {
  const  { navigate } = useNavigation<Nav>();
  const dispatch = useAppDispatch()

  const allNotifications = useAppSelector(notifications)
  const loader = useAppSelector(loading)

  useEffect(() => {
    dispatch(getUserNotifications())
  }, [])



  const Dummynotifications = [
    {
        title: 'New Order',
        time: '2 mins ago',
        image: Union
    },
    {
        title: 'Order Completed',
        time: '5 mins ago',
        image: TickSquare
    },
    {
        title: 'Pending Order',
        time: '10 mins ago',
        image: InfoCircle
    },
    {
        title: 'Payment Received',
        time: '1 day ago',
        image: Cash
    },
    {
        title: 'Product Out of Stock',
        time: '3 days ago',
        image: Danger
    },
    {
        title: 'New Message',
        time: '5 Days ago',
        image: Chat
    },
  ]

  const renderItem = ({item}: any) => (
    <NotificationCard item={item}/>
  );

//   if(loader){
//     return (
//         <SafeAreaView>
//             <View style={[globalStyles.rowCenter, {flex: 1}]}>
//                 <ActivityIndicator size={'small'}/>
//             </View>
//         </SafeAreaView>
//     )
//   }

  return (
    <SafeAreaView>
      <FlatList
            data={Dummynotifications}
            renderItem={renderItem}
            keyExtractor={item => item?.title}
            contentContainerStyle={{paddingBottom: hp(100)}}
            style={{marginBottom: hp(-50)}}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
});
