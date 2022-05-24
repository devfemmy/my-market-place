import React from 'react';
import { SafeAreaView, Text } from '../../../components/common';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

export const Home = (): JSX.Element => {
  const navigation = useNavigation()


  return (
    <SafeAreaView>
      <Text text="Home" />
      <Text text='Go to Welcome screen' onPress={() => navigation.navigate("WelcomeScreen")} />
    </SafeAreaView>
  );
};
