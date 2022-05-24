import 'react-native-gesture-handler';
// import 'react-native-reanimated';
import React from 'react';
import {StatusBar} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import {Provider as PaperProvider} from 'react-native-paper';
import {ApplicationProvider as UIKittenProvider} from '@ui-kitten/components';
import {NavigationContainerComponent} from './src/navigations';

const App = (): JSX.Element => {
  
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainerComponent />
    </SafeAreaProvider>
  );
};

export default (): JSX.Element => {
  return (
    <PaperProvider>
      <UIKittenProvider {...eva} theme={eva.light}>
        <App />
      </UIKittenProvider>
    </PaperProvider>
  );
};
