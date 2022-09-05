import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, ActivityIndicator} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {NoProducts} from '../../../../constants/images';
import {NoAccount} from './Empty';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getPayouts, payouts, loading, error } from '../../../../redux/slices/StoreSlice';
import { Payouts } from './Payouts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Account = (): JSX.Element => {

  const dispatch = useAppDispatch()
  const payoutData = useAppSelector(payouts)
  const loader = useAppSelector(loading)
  const payoutError = useAppSelector(error)

  useEffect(() => {
    getPayout()
  }, [])

  const getPayout = async () => {
    const id: string = await AsyncStorage.getItem('activeId')
    await dispatch(getPayouts(id))
  }


  if(loader){
    return (
        <SafeAreaView>
            <View style={[globalStyles.rowCenter, {flex: 1}]}>
                <ActivityIndicator size={'small'}/>
            </View>
        </SafeAreaView>
    )
  }
  console.log(payoutError)

  console.log(payoutData)

  return (
    <View style={globalStyles.wrapper}>
      {!payoutData || payoutData?.length < 1 ? <NoAccount/> : <Payouts data={payoutData}/>}
    </View>
  );
};
