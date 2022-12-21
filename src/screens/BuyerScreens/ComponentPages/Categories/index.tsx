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
import CategoryCard from '../../../../components/resuable/CategoriesCard';
import { Input } from '../../../../components/common/TextInput';

export const Categories = (): JSX.Element => {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const {title, data} = route?.params

  const renderItem = ({ item }) => (
        <CategoryCard item={item} />
  );

  useEffect(() => {
    navigation.setOptions({
        title: title
    })
  }, [])

  return (
    <View style={globalStyles.wrapper}>
        <View style={{paddingHorizontal: hp(15)}}>
          <Input
              label={''}
              placeholder={`Search ${title}`}
              iconMarginTop={hp(15)}
              searchInput
              containerStyle={{width: '100%', height: hp(50)}}
              style={{height: hp(50)}}
          />
        </View>
        <View style={{flex: 1}}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                numColumns={2}
                style={{alignSelf: 'center', width: '100%'}}
                contentContainerStyle={{alignItems: 'center'}}
            />
        </View>
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
