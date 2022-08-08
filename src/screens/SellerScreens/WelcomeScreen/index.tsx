import React, {useState} from 'react';

import {StatusBar, View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView, Text} from '../../../components/common';
import { colors } from '../../../utils/themes';
import { useNavigation} from '@react-navigation/native';
import {Button} from '../../../components/common/Button';
import {hp, wp} from '../../../utils/helpers';
import WelcomeCard from '../../../components/resuable/WelcomeCard';
import {globalStyles} from "../../../styles/globalStyles"
import { Nav, WelcomeType } from '../../../utils/types';






export const WelcomeScreen = (): JSX.Element => {
  const  { navigate } = useNavigation<Nav>();

  const [selected, setSelected] = useState('');

  const welcomeInfo = [
    {
      id: 1,
      header: 'Continue as a Seller',
      title:
        'I want to create a store where i can add products and sell on Bazara.',
      type: 'Seller',
    },
    {
      id: 2,
      header: 'Continue as a Buyer',
      title: 'I just want to shop and purchase items on Bazara for now.',
      type: 'Buyer',
    },
  ];

  const handleClick = (data: string) => {
    setSelected(data);
  };

  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>
        <View style={[styles.containerView, globalStyles.container]}>
          <View style={styles.div}>
            <Text text="Welcome Damilola 🎉" fontSize={20} />
            <Text
              text="We are happy to have you onboard the Bazara platform."
              fontSize={14}
              style={styles.text}
            />
            <View>
              {welcomeInfo?.map((data: WelcomeType) => {
                return (
                  <WelcomeCard
                    key={data?.id}
                    header={data?.header}
                    title={data?.title}
                    type={data?.type}
                    selected={selected}
                    handleClick={() => handleClick(data?.type)}
                  />
                );
              })}
            </View>
          </View>
          <View style={styles.btn}>
             <Button title={'Continue'} onPress={() => navigate('StoreCreationScreen')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerView: {
    marginTop: 30,
    flexDirection: 'column',
    flex: 1,
    height: hp(700),
  },
  div: {
    flexDirection: 'column',
    flex: 8,
    marginTop: 10,
  },
  text: {
    color: colors.gray,
    width: wp(280),
    lineHeight: 20,
  },
  btn: {
    marginTop: 20,
    flex: 1,
  },
});
