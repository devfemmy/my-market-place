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
import { loading, getSellerNotifications, notifications, error } from '../../redux/slices/userSilce';
import NotificationCard from '../../components/resuable/NotificationCard';
import { useRoute } from '@react-navigation/native';

export const NotificationDetails = (): JSX.Element => {
  const  navigation = useNavigation<Nav>();
  const route = useRoute();
  const title = route?.params?.title
  const type = route?.params?.type
  const dispatch = useAppDispatch()

  const allNotifications = useAppSelector(notifications)
  const loader = useAppSelector(loading)
  const errorMsg = useAppSelector(error)

  useEffect(() => {
    dispatch(getSellerNotifications(type))
    navigation.setOptions({
      title: title
    });
    }, [navigation]);

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
            data={allNotifications}
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
