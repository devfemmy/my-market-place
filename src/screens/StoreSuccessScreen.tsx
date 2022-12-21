

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView } from '../components/common';
import { View, Image } from 'react-native';

import { Button } from '../components/common/Button';
import { globalStyles } from '../styles';

import { StoreSuccessScreenNavigationProp } from '../navigations/Seller/types';
import { colors } from '../utils/themes';
import { hp } from '../utils/helpers';

import { correctLogo } from '../assets';
import { SuccesssLogo } from '../constants/images';
import { Text } from '../components/common';
import { styles } from './SellerScreens/AuthStoreSuccessScreen/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoreSuccessScreen = ({navigation}: any) => {

  const routeDone = async () => {
    await AsyncStorage.removeItem('type')
    return navigation.navigate('SellerScreen', {screen: 'Store'})
  }


  return (
    <SafeAreaView>
            <View style={[styles.container, styles.width80]}>
                <Image
                    source={SuccesssLogo}
                    style={styles.logo}
                />
                <Text fontWeight="700" fontSize={hp(26)} text="Great! Store Created" />
                <Text
                    fontWeight="300"
                    fontSize={hp(15)}
                    lineHeight={hp(25)}
                    style={styles.sub}
                    color={colors.gray}
                    textAlign="center"
                    text="You’re almost there. Now let’s add other items to your store"
                />
            </View>
            <View style={[globalStyles.footer, styles.width100]}>
                <Button
                    title={'Continue'}
                    onPress={() => routeDone()}
                />

            </View>
        </SafeAreaView>
  )
}

export default StoreSuccessScreen