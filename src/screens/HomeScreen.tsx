/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '../components/common'
import { Banner, Banner1 } from '../constants/images'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getProfile } from '../redux/slices/ProfileSlice'
import { userProfile } from '../redux/slices/userSilce'
import { globalStyles } from '../styles'
import { hp } from '../utils/helpers'
import AllCategories from './BuyerScreens/main/Home/Layout/allCategories'
import UserHeader from './BuyerScreens/main/Home/Layout/header'
import TopProducts from './BuyerScreens/main/Home/Layout/topProducts'
import { useIsFocused } from "@react-navigation/native";
import SearchComponent from '../components/SearchComponent/SearchComponent'


const HomeScreen = ({navigation}: any) => {
  const dispatch = useAppDispatch()
  const [user, setUser] = useState<any>(null)
  const [searchValue, setSearchValue] = useState("")
  const isFocused = useIsFocused();


  useEffect(() => {
   const loadUser = async () => {
    var response = await dispatch(getProfile())
    if(getProfile.fulfilled.match(response)){
      setUser(response?.payload)
    }
    else {
      var errMsg = response?.payload as string
      setUser(null)
    }
   }
   loadUser()
  }, [isFocused])

// const submitKeyMessage = (e: any) => {
//   console.log("keys", e?.nativeEvent.key)
//  // return navigation.navigate("NoAuthSearch")
 
// }

const  submitKeyMessage = (e) => {
  if(searchValue?.length > 0){
    return navigation.navigate("NoAuthSearch", {
      params: {
        search: searchValue
      }
    })
  }
};

const submitSearch = () => {
    if(searchValue?.length > 0){
      return navigation.navigate("NoAuthSearch", {
        params: {
          search: searchValue
        }
      })
    }
}
  return (
    <SafeAreaView style={globalStyles.containerWrapper}>
      <UserHeader name={`${user?.first_name}`} image={user?.img_url} />
      <SearchComponent submitSearch={submitSearch} searchValue={searchValue} setSearchValue={setSearchValue} submitKeyMessage={(e: any) => submitKeyMessage(e)} />
      <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <Image source={Banner1} resizeMode='contain'  style={styles.imageContainer} />
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
    width: '100%',
    height: "100%"
  },
})