import 'react-native-gesture-handler';
// import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { Button, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import { Provider as PaperProvider } from 'react-native-paper';
import { ApplicationProvider as UIKittenProvider } from '@ui-kitten/components';
import { NavigationContainerComponent } from './src/navigations';
import { Provider } from "react-redux"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { store } from './src/redux/store';
import SplashScreen from 'react-native-splash-screen'
import { NotifierWrapper } from 'react-native-notifier';
import BodyContaner from './src/screens/BodyContainer';

const App = (): JSX.Element => {
  useEffect(() => {
    SplashScreen.hide();
    GoogleSignin.configure({
      webClientId: "962853764584-0e6b1hshuvm5obq8lipkd4tkoebt3scb.apps.googleusercontent.com",
      iosClientId: "962853764584-0aimp14rac2qi4er2e0mmdgp97cu246o.apps.googleusercontent.com"
    });
  })



  return (
    <PaperProvider >
      <UIKittenProvider {...eva} theme={eva.light}>
        <Provider store={store}>
          <SafeAreaProvider style={{ backgroundColor: 'black' }}>
            <StatusBar barStyle="dark-content" />
            <BodyContaner />
          </SafeAreaProvider>
        </Provider>
      </UIKittenProvider>
    </PaperProvider>


  );
};

export default App

