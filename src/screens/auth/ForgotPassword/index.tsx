import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, Text} from '../../../components/common';
import {ForgotPasswordScreenNavigationProp} from '../../../navigations/types';

const ForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  return (
    <SafeAreaView>
      <Text onPress={() => navigation.goBack()} text="Back to login" />
    </SafeAreaView>
  );
};

export default ForgotPassword;
