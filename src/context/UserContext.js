import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation';
import { CommonActions } from '@react-navigation/native';
// Create User Context
const UserContext = createContext();

// Custom Hook for accessing UserContext
export const useUser = () => useContext(UserContext);

// User Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Indicates loading state during initialization

  // Initialize user and token from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Login Function
  const loginUser = async (userData, authToken) => {
    try {
      // Save user data and token in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('authToken', authToken);
      setUser(userData);
      setToken(authToken);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  // Logout Function
  const logoutUser = async (navigation) => {
    try {
      // Clear user data and token from AsyncStorage
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setToken(null);

      // Reset the navigation stack and redirect to Login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, token, loading, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
