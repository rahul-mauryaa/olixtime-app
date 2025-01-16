import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../../navigation';
import logo from '../../../assets/logo.png'; // Ensure the path is correct

const SplashScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;