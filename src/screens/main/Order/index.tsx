import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { AuthContext } from '../../../context/context';
import { Button } from '../../../components/common/Button';
import {View, Image, ActivityIndicator} from 'react-native';
import {globalStyles} from '../../../styles';
import {hp,wp} from '../../../utils/helpers';
import {NoProducts} from '../../../constants/images';
import {NoOrder} from './Empty';
import { Orders } from './Orders';
import { selectedOrders, loading } from '../../../redux/slices/orderSlice';
import { getAllOrders } from '../../../redux/slices/orderSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export const Order = (): JSX.Element => {
  const {signIn} = useContext(AuthContext)
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectedOrders)
  const loader = useAppSelector(loading)

  useEffect(() => {
    dispatch(getAllOrders())
  }, [])

  console.log(orders.length)

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
    <SafeAreaView>
      {orders.length < 1 ? <NoOrder/> : <Orders data={orders}/>}
    </SafeAreaView>
  );
};
