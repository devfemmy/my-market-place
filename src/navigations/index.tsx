import React, {useMemo, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthStackNavigator} from './AuthStackNavigator';
import {MainStackNavigator} from './MainStackNavigator';
import {AuthContext} from '../context/context';
import { SafeAreaView } from '../components/common';
import { ActivityIndicator, View } from 'react-native';
import { globalStyles } from '../styles';

export const NavigationContainerComponent = (): JSX.Element => {
  const [userToken, setUserToken] = useState(null);
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
  return (
    <AuthContext.Provider value={authContext}>
      {loading ?
      <View style={[globalStyles.wrapper, {alignItems: 'center', justifyContent: 'center'}]}>
        <ActivityIndicator size={'small'}/>
      </View>
      :
      <NavigationContainer>
        {userToken === null ? <AuthStackNavigator /> : <MainStackNavigator />}
      </NavigationContainer>
      }
    </AuthContext.Provider>
  );
};
