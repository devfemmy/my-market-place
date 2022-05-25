import React, { useState } from 'react';

import { StatusBar, View, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView, Text } from '../../components/common';
import { globalTheme } from '../../utils/themes';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from "../../styles/globalStyles"
import StoreHeader from '../../components/resuable/StoreHeader';
import ScrollCard from '../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {colorCart} from "../../assets"



type Nav = {
  navigate: (value: string) => void;
}

export const StoreScreen = (): JSX.Element => {
  const { navigate } = useNavigation<Nav>();




  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>
        <StoreHeader />
        <View style={globalStyles.container}>
          <ScrollCard />
          <View style={globalStyles.rowBetweenNoCenter}>
            <View style={globalStyles.rowStart}>
              <Image source={colorCart} style={styles.cart} />
              <Text text="Order" />
            </View>
            <View style={globalStyles.rowStart}>
              <Text text="100" />
              <Ionicons
                name={"copy-outline"}
                size={15}
                color={'white'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cart: {
    width: 20,
    height: 20,
    marginRight: 5
  }
});
