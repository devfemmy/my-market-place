import React, {useContext} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';

export const Inbox = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();

  return (
    <SafeAreaView>
      
    </SafeAreaView>
  );
};
