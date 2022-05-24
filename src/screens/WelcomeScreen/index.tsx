import React, {useState} from 'react';
import {useFormik} from 'formik';
import {StatusBar, View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView, Text} from '../../components/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Input} from '../../components/common/TextInput';
import {StoreFormData} from '../../models';
import {colors, StoreFormSchema} from '../../constants';
import {locationData} from '../../utils/locationJson';
import {Select} from '../../components/common/SelectInput';
import {useNavigation} from '@react-navigation/native';
import {Button} from '../../components/common/Button';
import {hp, wp} from '../../utils';
import WelcomeCard from '../../components/resuable/WelcomeCard';

export const WelcomeScreen = (): JSX.Element => {
  const navigation = useNavigation();
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

  const handleClick = (data: any) => {
    setSelected(data);
  };

  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>
        <View style={styles.containerView}>
          <View style={styles.div}>
            <Text text="Welcome Damilola 🎉" fontSize={20} />
            <Text
              text="We are happy to have you onboard the Bazara platform."
              fontSize={14}
              style={styles.text}
            />
            <View>
              {welcomeInfo?.map((data: any) => {
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
            <Button
              text="Continue"
              onPress={() => navigation.navigate('StoreCreationScreen')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerView: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    flexDirection: 'column',
    flex: 1,
    height: hp(800),
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
