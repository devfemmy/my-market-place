import React, {useState, useEffect} from 'react';

import {StatusBar, View, StyleSheet, ScrollView, ActivityIndicator, FlatList} from 'react-native';
import {SafeAreaView, Text} from '../../../components/common';
import { colors } from '../../../utils/themes';
import { InfoCircle, Danger, Union, Cash, TickSquare, Chat } from '../../../constants/images';
import { useNavigation} from '@react-navigation/native';
import {Button} from '../../../components/common/Button';
import {hp, wp} from '../../../utils/helpers';
import {globalStyles} from "../../../styles/globalStyles"
import { Nav } from '../../../utils/types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { loading, getSellerNotificationsStat, notificationStat } from '../../../redux/slices/userSilce';
import NotificationCard from '../../../components/resuable/NotificationCard';

export const NotificationScreen = (): JSX.Element => {
  const  { navigate } = useNavigation<Nav>();
  const dispatch = useAppDispatch()

  const allNotifications = useAppSelector(notificationStat)
  const loader = useAppSelector(loading)

  useEffect(() => {
    dispatch(getSellerNotificationsStat())
  }, [])

  const notificationTypes = [
    // {
    //     title: 'New Order',
    //     time: '2 mins ago',
    //     image: Union
    // },
    {
        title: 'Order Completed',
        time: allNotifications?.completedOrders?.lastCreatedAt,
        image: TickSquare,
        count: allNotifications?.completedOrders?.count,
        type: "order-confirmation"
    },
    {
        title: 'Pending Order',
        time: allNotifications?.pendingOrders?.lastCreatedAt,
        image: InfoCircle,
        count: allNotifications?.pendingOrders?.count,
        type: "order-request"
    },
    {
        title: 'Payment Received',
        time: allNotifications?.paymentReceived?.lastCreatedAt,
        image: Cash,
        count: allNotifications?.paymentReceived?.count,
        type: ""
    },
    {
        title: 'Product Out of Stock',
        time: allNotifications?.productsOutOfStock?.lastCreatedAt,
        image: Danger,
        count: allNotifications?.productsOutOfStock?.count,
        type: ""
    },
    // {
    //     title: 'New Message',
    //     time: '5 Days ago',
    //     image: Chat
    // },
  ]

  const renderItem = ({item}: any) => (
    <NotificationCard item={item}/>
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
    <View style={globalStyles.wrapper}>
      <FlatList
            data={notificationTypes}
            renderItem={renderItem}
            keyExtractor={item => item?.title}
            contentContainerStyle={{paddingBottom: hp(100)}}
            style={{marginBottom: hp(-50)}}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  
});
