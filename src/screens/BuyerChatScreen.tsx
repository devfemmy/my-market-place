import { View,  StyleSheet } from 'react-native'
import React from 'react'
import { Text } from '../components/common'
import { hp } from '../utils/helpers'

const BuyerChatScreen = () => {
  return (
    <View style={styles.container}>
     <Text text='Buyer Chat Screen' />
    </View>
  )
}

export default BuyerChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: hp(10)
  }
})