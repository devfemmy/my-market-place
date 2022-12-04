import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import { View, ActivityIndicator, StatusBar, StyleSheet, Image, ScrollView } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import { globalStyles } from '../../../../styles';
import { userProfile, getUserDetails, loading } from '../../../../redux/slices/userSilce';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import UserHeader from './Layout/header';
import AllCategories from './Layout/allCategories';
import TopProducts from './Layout/topProducts';
import { getAllCategories } from '../../../../redux/slices/sideHustleSlice';
import { Banner } from '../../../../constants/images';
import { colors } from '../../../../utils/themes';
import { hp } from '../../../../utils/helpers';
import { getProfile } from '../../../../redux/slices/ProfileSlice';

export const Home = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();
  const user = useAppSelector(userProfile)
  const loader = useAppSelector(loading)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getProfile())
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
    <SafeAreaView style={{backgroundColor: 'red'}}>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <UserHeader name={`${user?.first_name}`} image={user?.img_url} />
      <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.imageCard}>
            <Image source={Banner} resizeMode='contain' style={styles.imageContainer} />
        </View>

        <AllCategories/>

        <TopProducts/>
        
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  imageCard: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: hp(200),
    paddingHorizontal: hp(15)
  },
  imageContainer: {
      width: '100%'
  },
})
