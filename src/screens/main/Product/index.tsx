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
import {NoProduct} from './Empty';
import { getUserDetails } from '../../../redux/slices/userSilce';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { myStore } from '../../../redux/slices/StoreSlice';
import { getAllProducts, myProducts, loading } from '../../../redux/slices/productSlice';
import { Products } from './Products';

export const Product = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const mystore = useAppSelector(myStore)
  const products = useAppSelector(myProducts)
  const loader = useAppSelector(loading)

  useEffect(() => {
    dispatch(getUserDetails())
    dispatch(getAllProducts(mystore[0]?._id))
  }, [])

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
      {products.length < 1 ? <NoProduct/> : <Products data={products} store={mystore[0]}/>}
    </SafeAreaView>
  );
};
