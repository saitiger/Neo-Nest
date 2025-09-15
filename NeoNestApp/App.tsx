/**
 * Neo-Nest Mobile App
 * Supporting preterm families with corrected age tracking
 */

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {AuthProvider} from './src/contexts/AuthContext';
import {BabyProfileProvider} from './src/contexts/BabyProfileContext';
import RootNavigator from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#3498db" />
      <AuthProvider>
        <BabyProfileProvider>
          <RootNavigator />
        </BabyProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;