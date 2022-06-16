import React, {useContext} from 'react';
import {SafeAreaView, Text} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { AuthContext } from '../../../context/context';
import { Button } from '../../../components/common/Button';
import {View, Image} from 'react-native';
import {globalStyles} from '../../../styles';
import {hp,wp} from '../../../utils/helpers';
import {NoProducts} from '../../../constants/images';
import {NoAccount} from './Empty';

export const Account = (): JSX.Element => {

  return (
    <View style={globalStyles.wrapper}>
      <NoAccount/>
    </View>
  );
};
