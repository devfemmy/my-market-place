import React, {useContext} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {NoProducts} from '../../../../constants/images';
import { colors } from '../../../../utils/themes';

export const NoProduct = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();
  const {authContext: { signIn }} = useContext(AuthContext)

  return (
      <View style={[globalStyles.selfCenter]}>
        <Image source={NoProducts} style={[globalStyles.selfCenterImage, globalStyles.Verticalspacing]} resizeMode="contain" />
        <Text style={[globalStyles.Verticalspacing]} fontWeight="500" fontSize={hp(20)} text="No Products Yet" />
        <Text style={[globalStyles.Verticalspacing]} fontWeight="400" color={colors.darkGrey} textAlign='center' fontSize={hp(15)} text="Add products to your store to start selling" />
        <Button 
        title={'Add Product'}
        size='medium'
        style={[globalStyles.Verticalspacing, {height: hp(55)}]}
        onPress={() => navigate('AddProduct')} />
      </View>
  );
};
