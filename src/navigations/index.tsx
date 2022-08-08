import React, {useMemo, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthStackNavigator} from './AuthStackNavigator';
import {SellerMainStackNavigator} from './Seller/MainStackNavigator';
import { BuyerMainStackNavigator } from './Buyer/MainStackNavigator';
import {AuthContext} from '../context/context';
import { SafeAreaView } from '../components/common';
import { ActivityIndicator, View } from 'react-native';
import { globalStyles } from '../styles';

export const NavigationContainerComponent = (): JSX.Element => {
  const [userToken, setUserToken] = useState(null);
  const [journey, setJourney] = useState('seller');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    try {
      AsyncStorage.getItem("token")
      .then(async value => {
        if(value){
          setUserToken(value)
        }
        setLoading(false)
      })
    } catch(error){
      console.log(error)
      setLoading(false)
    }
  }, [])

  const authContext = useMemo(
    () => ({
      signIn: (token: string) => {
        setUserToken(token);
      },
      signOut: () => {
        setUserToken(null);
      },
    }),
    [],
  );

  const journeyContext = useMemo(
    () => ({
      sellerJourney: () => {
        setJourney('seller');
      },
      buyerJourney: () => {
        setJourney('buyer');
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={{authContext, journeyContext}}>
      {loading ?
      <View style={[globalStyles.wrapper, {alignItems: 'center', justifyContent: 'center'}]}>
        <ActivityIndicator size={'small'}/>
      </View>
      :
      ( journey == 'seller' ?
        <NavigationContainer>
          {userToken === null ? <AuthStackNavigator /> : <SellerMainStackNavigator />}
        </NavigationContainer>
        :
        <NavigationContainer>
          {userToken === null ? <AuthStackNavigator /> : <BuyerMainStackNavigator />}
        </NavigationContainer>
      )
      }
    </AuthContext.Provider>
  );
};
