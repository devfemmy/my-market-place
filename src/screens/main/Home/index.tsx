import React from 'react';
import {SafeAreaView, Text} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';


export const Home = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();

  return (
    <SafeAreaView>
      <Text text="Home" />
      {/* <Text
        text="Go to Welcome screen"
        onPress={() => navigate('WelcomeScreen')}
      />
      <Text
        text="Go to Store success screen"
        onPress={() => navigate('StoreSuccessScreen')}
      /> */}
    </SafeAreaView>
  );
};
