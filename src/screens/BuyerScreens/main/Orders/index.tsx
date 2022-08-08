import React, {useContext} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { hp } from '../../../../utils/helpers';
import { globalStyles } from '../../../../styles';
import { colors } from '../../../../utils/themes';

export const Orders = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();

  const filters = ['All', 'Pending', 'Delivered', 'Cancelled']

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
        <Text 
          text={item} 
          fontSize={hp(16)}
          color={colors.white}
          textAlign={'center'}
          numberOfLines={1}
        />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <View style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
            <Text
                text={'Orders'}
                numberOfLines={1}
                fontWeight={"500"}
                color={colors.white}
                fontSize={hp(20)}
            />
      </View>
      <View style={{padding: hp(15)}}>
        <FlatList
            data={filters}
            renderItem={renderItem}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
      </View>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  itemContainer: {
      paddingVertical: hp(15),
      paddingHorizontal: hp(30),
      backgroundColor: colors.darkBlack,
      marginRight: hp(15),
      borderRadius: hp(50)
  }
})
