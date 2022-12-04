import React, { useMemo, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackNavigator } from './AuthStackNavigator';
import { SellerMainStackNavigator } from './Seller/MainStackNavigator';
import { BuyerMainStackNavigator } from './Buyer/MainStackNavigator';
import { AuthContext } from '../context/context';
import { SafeAreaView, Text } from '../components/common';
import { ActivityIndicator, View } from 'react-native';
import { globalStyles } from '../styles';
import { useAppSelector } from '../redux/hooks';
import { userState } from '../redux/slices/AuthSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';


export const NavigationContainerComponent = (): JSX.Element => {
  const [userToken, setUserToken] = useState(null);
  const [journey, setJourney] = useState('seller');
  const [loading, setLoading] = useState(true);

  const auth = useAppSelector(userState)
  const [token, setToken] = useState<string>()

  

  useEffect(() => {
    setLoading(true)
    const getToken = async () => {
      try {
        var localToken = await AsyncStorage.getItem('token') as string
        if (localToken) {
          setToken(localToken)
          setLoading(false)
        }

      }
      catch (e) {
        console.log({ e })
        setLoading(false)
      }
    }

    getToken()

  }, [token])


  const cd = () => {
    console.log("pressed")
    console.log({ token, auth })
  }


  return (
    <TouchableOpacity onPress={() => cd()}>
      <View>
        
      </View>
    </TouchableOpacity>


  );
};
