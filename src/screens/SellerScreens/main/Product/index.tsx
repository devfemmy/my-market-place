import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, ActivityIndicator, StyleSheet} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {NoProducts} from '../../../../constants/images';
import {NoProduct} from './Empty';
import { getUserDetails } from '../../../../redux/slices/userSilce';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { myStore } from '../../../../redux/slices/StoreSlice';
import { getAllProducts, myProducts, loading, selectedProducts, searching } from '../../../../redux/slices/productSlice';
import { SkeletonView } from '../../../../components/resuable/Skeleton';
import { Products } from './Products';
import { Input } from '../../../../components/common/TextInput';
import { colors } from '../../../../utils/themes';

export const Product = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const mystore = useAppSelector(myStore)
  const myproducts = useAppSelector(myProducts)
  const products = useAppSelector(selectedProducts)
  const loader = useAppSelector(loading)
  

  useEffect(() => {
    dispatch(getUserDetails())
    dispatch(getAllProducts(mystore[0]?._id))
  }, [])

  // if(loader){
  //   return (
  //       <SafeAreaView>
  //           <View style={[globalStyles.rowCenter, {flex: 1}]}>
  //               <ActivityIndicator size={'small'}/>
  //           </View>
  //       </SafeAreaView>
  //   )
  // }

  if(loader){
    return (
      <SafeAreaView>
        <View style={[globalStyles.rowBetween, globalStyles.lowerContainer]}>
            <Text
                text={'Loading...'}
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
              placeholder={"Search for products"}
              searchInput
              containerStyle={{width: '100%'}}
              editable={false}
          />
        </View>
        <SkeletonView 
        number={10} 
        style={[styles.cardContainer, globalStyles.rowStart]}
        imgStyle={styles.image}
        />
      </SafeAreaView>
    )
    
  }

  return (
    <SafeAreaView>
      {myproducts.length < 1 || mystore.length < 1 ? <NoProduct/> : <Products data={products} store={mystore[0]}/>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
      height: hp(50),
      width: hp(50),
      borderRadius: hp(5),
      marginRight: hp(10),
  },
  cardContainer: {
      flexDirection: 'column',
      paddingVertical: hp(15),
      borderBottomWidth: 1,
      borderColor: colors.black,
      paddingHorizontal: hp(15)
  }
})
