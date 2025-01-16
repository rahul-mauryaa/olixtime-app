import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FastImage from 'react-native-fast-image';
import {useUser} from '../../context/UserContext';
import {URL} from '../../constants/url';

export default function Profile() {
  const {user, token, loginUser, logoutUser} = useUser(); // Access user data and context functions
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    dob: '',
    previewUrl: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const saveProfile = async () => {
    try {
      if (!token) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      const response = await fetch(`${URL.UPDATE_USER}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use token from context
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        loginUser(updatedData, token); // Update global state in context
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      Alert.alert('Save Changes?', 'Do you want to save your changes?', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Save',
          onPress: () => {
            saveProfile();
            setIsEditing(false);
          },
        },
      ]);
    } else {
      setIsEditing(true);
    }
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setProfileData({
        ...profileData,
        dob: selectedDate.toISOString().split('T')[0],
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <FastImage
            source={
              profileData?.previewUrl
                ? {uri: profileData.previewUrl}
                : require('../../assets/user-profile.jpg')
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profileData.username}</Text>
          <Text style={styles.userRole}>User</Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.infoField}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]} // Apply disabled style
              value={profileData.username}
              editable={isEditing} // Disable editing
            />
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]} // Apply disabled style
              value={profileData.email}
              editable={false} // Disable editing
            />
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]} // Apply disabled style
              value={profileData.phone}
              editable={isEditing} // Disable editing
            />
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              onPress={() => isEditing && setShowDatePicker(true)}
              style={[
                styles.datePickerContainer,
                !isEditing && styles.disabledInput,
              ]} // Apply disabled style
              disabled={!isEditing} // Disable the date picker
            >
              <Text style={styles.label}>
                {profileData.dob || 'Select Date of Birth'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={profileData.dob ? new Date(profileData.dob) : new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Hide the Edit Profile button */}
          {isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditToggle}>
              <Text style={styles.editButtonText}>
                {isEditing ? 'SAVE CHANGES' : 'EDIT PROFILE'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#1c1c2c',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  userRole: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 20,
  },
  profileInfo: {
    backgroundColor: '#2c2c3c',
    borderRadius: 10,
    padding: 20,
  },
  editButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoField: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1c1c2c',
    borderRadius: 5,
    padding: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  disabledInput: {
    backgroundColor: '#3c3c4c', // Different background color for disabled state
    borderColor: '#666', // Different border color for disabled state
    color: '#999', // Different text color for disabled state
  },
  datePickerContainer: {
    backgroundColor: '#1c1c2c',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4A90E2',
    padding: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
