import React, { useEffect } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '../components/common'
import { Banner } from '../constants/images'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getProfile } from '../redux/slices/ProfileSlice'
import { userProfile } from '../redux/slices/userSilce'
import { globalStyles } from '../styles'
import { hp } from '../utils/helpers'
import AllCategories from './BuyerScreens/main/Home/Layout/allCategories'
import UserHeader from './BuyerScreens/main/Home/Layout/header'
import TopProducts from './BuyerScreens/main/Home/Layout/topProducts'

const HomeScreen = (navigation: any) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(userProfile)

  

  useEffect(() => {
    dispatch(getProfile())
  }, [])


  return (
    <SafeAreaView style={globalStyles.containerWrapper}>
      <UserHeader name={`${user?.first_name}`} image={user?.img_url} />
      <ScrollView>
        <View style={styles.imageCard}>
          <Image source={Banner} resizeMode='contain' style={styles.imageContainer} />
        </View>

        <AllCategories navigation={navigation} />

        <TopProducts />
      </ScrollView>


    </SafeAreaView>
  )
}

export default HomeScreen

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