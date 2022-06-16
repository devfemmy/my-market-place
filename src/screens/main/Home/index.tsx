import React, {useContext} from 'react';
import {SafeAreaView, Text} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { AuthContext } from '../../../context/context';
import { Button } from '../../../components/common/Button';

export const Home = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();
  const {signIn} = useContext(AuthContext)

  const LogOut = () => {
    signIn(null)
  }
  return (
    <SafeAreaView>
      {/* <Text text="Home" /> */}
      <Button title={'Sign Out'} onPress={LogOut} />
      <Text
        text="Go to Store success screen"
        onPress={() => navigate('StoreSuccessScreen')}
      /> 
       <Text
        text="Go to Store creation"
        onPress={() => navigate('AuthStoreCreationScreen')}
      /> 
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
