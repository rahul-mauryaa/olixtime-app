
import React, {useState} from 'react';
import Navigation from './src/navigation';
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserProvider } from './src/context/UserContext';
const App = () => {
 return(
 
    <UserProvider>
        <SafeAreaProvider>
          <Navigation />
          <FlashMessage position="top" duration={3000} />
        </SafeAreaProvider>
    </UserProvider>
 )
};


export default App;
