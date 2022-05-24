import React, {useMemo, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {AuthStackNavigator} from './AuthStackNavigator';
import {MainStackNavigator} from './MainStackNavigator';
import {AuthContext} from '../context/context';

export const NavigationContainerComponent = (): JSX.Element => {
  const [userToken, setUserToken] = useState(null);

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
      <NavigationContainer>
        {!userToken === null ? <AuthStackNavigator /> : <MainStackNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
