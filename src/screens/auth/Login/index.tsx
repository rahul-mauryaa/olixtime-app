import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../context/UserContext';
import { URL } from '../../../constants/url';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome'; // For eye icon
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
const { width, height } = Dimensions.get('window'); // Get screen dimensions

type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Main: undefined;
  LeaveRequest: undefined;
};
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { loginUser } = useUser();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const loginResponse = await axios.post(`${URL.LOGIN}`, { email, password });

      if (loginResponse.status === 200) {
        const { token } = loginResponse.data;

        const profileResponse = await axios.get(`${URL.LOGINME}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileResponse.status === 200) {
          const userData = profileResponse.data;
          await loginUser(userData, token);

          showMessage({
            message: 'Success',
            description: 'Login successful!',
            type: 'success',
          });

          navigation.replace('Main'); 
        } else {
          showMessage({
            message: 'Error',
            description: 'Failed to fetch profile data.',
            type: 'danger',
          });
        }
      } else {
        showMessage({
          message: 'Error',
          description: 'Login failed. Please try again.',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Error',
        description: error.response?.data?.message || 'An error occurred.',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1c1c2c', '#2c2c3c', '#1c1c2c']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#bbb"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry={!showPassword} // Toggle secureTextEntry
              placeholderTextColor="#bbb"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#bbb"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.4, // Responsive width
    height: width * 0.4, // Responsive height
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: width * 0.08, // Responsive font size
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: width * 0.04, // Responsive font size
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2c2c3c',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: width * 0.04, // Responsive font size
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c3c',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#fff',
    fontSize: width * 0.04, // Responsive font size
  },
  eyeButton: {
    padding: 15,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045, // Responsive font size
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
    fontSize: width * 0.035, // Responsive font size
  },
  signupText: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 20,
    fontSize: width * 0.035, // Responsive font size
  },
  signupLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default Login;