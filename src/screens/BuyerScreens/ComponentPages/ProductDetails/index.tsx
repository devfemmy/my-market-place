import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import { View, ActivityIndicator, StatusBar, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import { globalStyles } from '../../../../styles';
import { userProfile, getUserDetails, loading } from '../../../../redux/slices/userSilce';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { getAllCategories } from '../../../../redux/slices/sideHustleSlice';
import { Banner } from '../../../../constants/images';
import { colors } from '../../../../utils/themes';
import { hp } from '../../../../utils/helpers';
import { useRoute } from '@react-navigation/native';
import BuyerProductCard from '../../../../components/resuable/BuyerProductCard';
import { Input } from '../../../../components/common/TextInput';

export const ProductDetails = (): JSX.Element => {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const {data} = route?.params

  useEffect(() => {

  }, [])

  return (
    <View style={globalStyles.wrapper}>

    </View>
  );
};

const styles = StyleSheet.create({
  imageCard: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: hp(180),
    paddingHorizontal: hp(15)
  },
  imageContainer: {
      width: '100%',
  },
})
