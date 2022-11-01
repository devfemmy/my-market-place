import { View, Text } from 'react-native'
import React from 'react'
import { Button } from '../components/common/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { signOutUser, userState } from '../redux/slices/AuthSlice'

const BuyerProfileScreen = ({navigation}: any) => {
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector(userState)



  const handleRemoval = async () => {
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem('activeId')
    await AsyncStorage.removeItem('activeName')
    await AsyncStorage.removeItem('activeSlug')
    await AsyncStorage.removeItem('merchant-slug')
    await AsyncStorage.removeItem('role')
    await AsyncStorage.removeItem('mode')
    await AsyncStorage.removeItem('userInfo')
    await AsyncStorage.removeItem('checking')
    await AsyncStorage.removeItem('type')
    await AsyncStorage.removeItem('prodId')
    await AsyncStorage.removeItem('slug')
    await AsyncStorage.removeItem('prodVarId')
    await AsyncStorage.removeItem('productDraft')
    await AsyncStorage.removeItem('editableId')
    
    await dispatch(signOutUser()).then(dd => console.log({dd}))
   // return navigation.navigate('HomeScreen')

  }


  return (
    <View>
      <Text>BuyerProfileScreen</Text>
      <Button title='Remove all Token' onPress={() => handleRemoval()} />
    </View>
  )
}

export default BuyerProfileScreen