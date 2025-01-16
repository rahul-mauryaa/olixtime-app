import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

const LeaveRequestForm = ({ onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loader

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!subject) newErrors.subject = 'Subject is required.';
    if (!reason) newErrors.reason = 'Reason is required.';
    if (!startDate) newErrors.startDateTime = 'Start date & time is required.';
    if (!endDate) newErrors.endDateTime = 'End date & time is required.';
    if (startDate && endDate && endDate <= startDate) {
      newErrors.endDateTime = 'End date & time must be after start date & time.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true); // Show loader

    const formData = {
      subject,
      reason,
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
    };

    try {
      await onSubmit(formData); // Pass form data to parent component
    } catch (error) {
      console.error('Error submitting leave request:', error);
    } finally {
      setIsSubmitting(false); // Hide loader
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Subject Input */}
      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter subject"
        placeholderTextColor="#aaa" // Light gray placeholder
        value={subject}
        onChangeText={setSubject}
      />
      {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}

      {/* Reason Input */}
      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter reason"
        placeholderTextColor="#aaa" // Light gray placeholder
        value={reason}
        onChangeText={setReason}
        multiline
      />
      {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}

      {/* Start Date Picker */}
      <Text style={styles.label}>Start Date & Time</Text>
      <TouchableOpacity onPress={() => setIsStartDatePickerOpen(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select start date & time"
          placeholderTextColor="#aaa" // Light gray placeholder
          value={startDate.toLocaleString()}
          editable={false}
        />
      </TouchableOpacity>
      <DatePicker
        modal
        open={isStartDatePickerOpen}
        date={startDate}
        onConfirm={(date) => {
          setIsStartDatePickerOpen(false);
          setStartDate(date);
        }}
        onCancel={() => {
          setIsStartDatePickerOpen(false);
        }}
        mode="datetime"
      />

      {/* End Date Picker */}
      <Text style={styles.label}>End Date & Time</Text>
      <TouchableOpacity onPress={() => setIsEndDatePickerOpen(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select end date & time"
          placeholderTextColor="#aaa" // Light gray placeholder
          value={endDate.toLocaleString()}
          editable={false}
        />
      </TouchableOpacity>
      <DatePicker
        modal
        open={isEndDatePickerOpen}
        date={endDate}
        onConfirm={(date) => {
          setIsEndDatePickerOpen(false);
          setEndDate(date);
        }}
        onCancel={() => {
          setIsEndDatePickerOpen(false);
        }}
        mode="datetime"
      />
      {errors.endDateTime && <Text style={styles.errorText}>{errors.endDateTime}</Text>}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting} // Disable button while submitting
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" /> // Show loader
        ) : (
          <Text style={styles.submitButtonText}>Submit Leave Request</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1c1c2c', // Dark background
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff', // White text
  },
  input: {
    height: 50,
    borderColor: '#4A90E2', // Blue border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#2c2c3c', // Dark input background
    color: '#fff', // White text
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4A90E2', // Blue button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    opacity: 1,
  },
  submitButtonText: {
    color: '#fff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30', // Red error text
    fontSize: 14,
    marginBottom: 10,
  },
});

export default LeaveRequestForm;