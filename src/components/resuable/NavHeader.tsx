import { View, StyleSheet } from 'react-native'
import React from 'react'
import { NavHeaderProps } from '../../interfaces'
import { globalStyles } from '../../styles'
import { hp } from '../../utils/helpers'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '../../components/common';

const NavHeader: React.FC<NavHeaderProps> = ({icon, handlePress, title}) => {
  return (
    <View style={[globalStyles.container, globalStyles.rowBetween, styles.StoreCard]}>
    <Ionicons
      name={icon}
      size={30}
      color={'white'}
      onPress={handlePress}
    />
    <Text text={title} fontSize={hp(18)} />
    <View />
  </View>
  )
}

export default NavHeader

const styles = StyleSheet.create({
    StoreCard: {
      paddingVertical: hp(20),
      cursor: 'pointer',
    }

  });
  