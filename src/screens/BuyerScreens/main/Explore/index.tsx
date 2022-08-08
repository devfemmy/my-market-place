import React, {useContext} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import { TouchableOpacity, View } from 'react-native';
import { Input } from '../../../../components/common/TextInput';
import { hp } from '../../../../utils/helpers';
import { globalStyles } from '../../../../styles';
import { colors } from '../../../../utils/themes';
import SubHeader from '../Home/Layout/subHeader';
import AllCategories from '../Home/Layout/allCategories';
import TrendingProducts from './Layout/trendingProducts';

export const Explore = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();

  return (
    <SafeAreaView>
      <View style={[globalStyles.rowBetween, {paddingHorizontal: hp(15)}]}>
        <Input
            label={''}
            placeholder={`Search`}
            iconMarginTop={hp(15)}
            searchInput
            containerStyle={{width: '82%', height: hp(40)}}
            style={{height: hp(40)}}
        />
        <TouchableOpacity>
          <Text 
          text={'Cancel'} 
          fontSize={hp(15)}
          color={colors.white}
          textAlign={'center'}
          numberOfLines={1}
          />
        </TouchableOpacity>
      </View>
      <AllCategories/>
      <TrendingProducts/>
    </SafeAreaView>
  );
};
