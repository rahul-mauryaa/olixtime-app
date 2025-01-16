import React, { FunctionComponent, useEffect } from "react";
import {  NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { View, ActivityIndicator, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

// Auth screens
import SplashScreen from "../screens/auth/SplashScreen/index";
import Login from "../screens/auth/Login/index";

// App screens
import Profile from "../screens/Profile/index";
import { useUser } from "../context/UserContext";
import Leave from "../screens/Leave";
import LeaveRequestScreen from "../components/LeaveRequestForm";

// Types for navigation props
type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Main: undefined;
  LeaveRequest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// Navigation reference
const navigationRef = React.createRef<any>();

export function navigate(name: string, params: any) {
  navigationRef.current?.navigate(name, params);
}

// Custom Drawer Content
const CustomDrawerContent = (props: any) => {
  const { user, logoutUser } = useUser();
  const handleLogout = () => {
    logoutUser(props.navigation);
  };

  return (
    <LinearGradient colors={['#1c1c2c', '#2c2c3c']} style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <Image
            source={user?.previewUrl ? { uri: user.previewUrl } : require("../assets/user-profile.jpg")}
            style={[styles.profileImage]}
          />
          <Text style={styles.userName}>{user?.username || "Guest"}</Text>
          <Text style={styles.userEmail}>{user?.email || "guest@example.com"}</Text>
        </View>

        {/* Default Drawer Items */}
        <DrawerItemList {...props} />

        {/* Custom Logout Button */}
        <DrawerItem
          label="Logout"
          onPress={() => handleLogout()}
          icon={({ color, size }) => <Icon name="log-out-outline" color={color} size={size} />}
          labelStyle={styles.drawerLabel}
          style={styles.logoutButton}
        />

        {/* App Info Section */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Version 1.0.0</Text>
          <Text style={styles.appInfoText}>OlixLab</Text>
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
};


const CustomHeader = ({ navigation, route }: any) => {
  return (
    <LinearGradient colors={['#1c1c2c', '#2c2c3c']} style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
        <Icon name="menu-outline" size={30} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Image
          source={require("../assets/logo.png")} // Replace with your logo
          style={[styles.logo]}
        />
        <Text style={styles.headerTitle}>{route.name || "App Name"}</Text>
      </View>
    </LinearGradient>
  );
};


// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        drawerStyle: { backgroundColor: "#1c1c2c", width: Dimensions.get("window").width * 0.7 }, // Responsive width
        drawerActiveTintColor: "#4CAF50",
        drawerInactiveTintColor: "#bbb",
        drawerLabelStyle: { fontSize: 16, fontWeight: "500" },
        drawerItemStyle: { marginVertical: 5, borderRadius: 10 },
        drawerActiveBackgroundColor: "#2c2c3c",
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Leave"
        component={Leave}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const Navigation: FunctionComponent = () => {
  const { token, loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "slide_from_right" }} // Add animation
        initialRouteName={token ? "Main" : "Login"}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

// Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c3c",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#bbb",
  },
  drawerLabel: {
    color: "#fff",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    marginTop: 20,
  },
  appInfo: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2c2c3c",
    alignItems: "center",
  },
  appInfoText: {
    fontSize: 12,
    color: "#bbb",
  },
  headerContainer: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c3c",
  },
  menuButton: {
    padding: 10,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});