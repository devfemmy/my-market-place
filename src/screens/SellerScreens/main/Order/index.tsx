import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {NoProducts} from '../../../../constants/images';
import {NoOrder} from './Empty';
import { Orders } from './Orders';
import { selectedOrders, loading, error } from '../../../../redux/slices/orderSlice';
import { getAllOrders } from '../../../../redux/slices/orderSlice';
import { Input } from '../../../../components/common/TextInput';
import { colors } from '../../../../utils/themes';
import { SkeletonView } from '../../../../components/resuable/Skeleton';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { InfoCircle } from '../../../../constants/images';
import { icons } from '../../../../utils/constants';

export const Order = (): JSX.Element => {
  const {authContext: { signIn }} = useContext(AuthContext)
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectedOrders)
  const loader = useAppSelector(loading)
  const Error = useAppSelector(error)

  useEffect(() => {
    dispatch(getAllOrders())
  }, [])

  if(loader){
    return (
      <SafeAreaView>
        <View style={[globalStyles.rowBetween, globalStyles.lowerContainer]}>
            <Text
                text={'Orders'}
                numberOfLines={1}
                fontWeight={"700"}
                color={colors.white}
                fontSize={hp(18)}
            />
            <View/>
        </View>
        <View style={{paddingHorizontal: hp(15)}}>
          <Input
              label={''}
              placeholder={"Search orders by name or id"}
              searchInput
              containerStyle={{width: '100%'}}
              editable={false}
          />
        </View>
        <SkeletonView 
        number={10} 
        style={[styles.cardContainer, globalStyles.rowStart]}
        imgStyle={styles.image}
        numberDesc={4}
        />
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
            <TouchableOpacity onPress={() => dispatch(getAllOrders())}>
              <icons.Ionicons style={{marginTop: hp(20)}} name="refresh-circle" size={40} color={colors.bazaraTint} />
            </TouchableOpacity>
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

const styles = StyleSheet.create({
  image: {
      height: hp(105),
      width: hp(105),
      borderRadius: hp(5),
      marginRight: hp(15),
  },
  cardContainer: {
      flexDirection: 'column',
      paddingVertical: hp(10),
      paddingHorizontal: hp(15)
  },
  underline: {
      borderBottomWidth: 1, 
      borderBottomColor: colors.gray,
      paddingVertical: hp(10)
  },
  text: {
      // marginTop: "-2%"
  },
  detContainer: {
      height: hp(105),
      justifyContent: 'space-between'
  }
})
