import React from 'react';
import {SafeAreaView, Text} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';


type Nav = {
  navigate: (value: string) => void;
}


export const Home = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();

  return (
    <SafeAreaView>
      <Text text="Home" />
      <Text
        text="Go to Welcome screen"
        onPress={() => navigate('WelcomeScreen')}
      />
    </SafeAreaView>
  );
};
