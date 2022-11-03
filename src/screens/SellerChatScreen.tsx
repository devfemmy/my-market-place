import { View, StyleSheet } from 'react-native'
import React from 'react'
import { hp } from '../utils/helpers'
import { Text } from '../components/common'

const SellerChatScreen = () => {
  return (
    <View style={styles.container}>
     <Text text='Seller Chat Screen' />
    </View>
  )
}

export default SellerChatScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      paddingTop: hp(10)
    }
  })