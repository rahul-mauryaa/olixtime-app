import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../../context/UserContext';
import LeaveRequestForm from '../../components/LeaveRequestForm';
import { URL } from '../../constants/url';
import { showMessage } from 'react-native-flash-message';

const MyList = () => {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [leaveRequestModalVisible, setLeaveRequestModalVisible] = useState(false);

  const { width } = useWindowDimensions();

  // Fetch leave requests
  const fetchItems = async (pageNumber: any) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      if (!token) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      const response = await fetch(
        `${URL.LEAVE_APPLICATIONS}?limit=10&page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        if (data.leaveRequests.length > 0) {
          setItems((prev) =>
            pageNumber === 1 ? data.leaveRequests : [...prev, ...data.leaveRequests],
          );
        } else {
          setHasMore(false); // No more data to fetch
        }
      } else {
        showMessage({
          message: 'Error',
          description: data.message || 'Failed to fetch items.',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'Something went wrong while fetching items.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load more items
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to fetch next set of data
    }
  };

  // Refresh the list
  const refreshItems = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchItems(1);
    setRefreshing(false);
  };

  // Handle leave request submission
  const handleLeaveRequestSubmit = async (formData: any) => {
    try {
      const response = await fetch(`${URL.REQUEST_LEAVE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage({
          message: 'Success',
          description: 'Leave request submitted successfully.',
          type: 'success',
        });
        setLeaveRequestModalVisible(false);
        refreshItems();
      } else {
        showMessage({
          message: 'Error',
          description: data.message || 'Failed to submit leave request.',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'Something went wrong while submitting the leave request.',
        type: 'danger',
      });
      console.error('Error submitting leave request:', error);
    }
  };

  const getBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'green'; 
      case 'pending':
        return 'yellow'; 
      case 'cancelled':
        return 'red';
      default:
        return '#2c2c3c'; // Default dark gray
    }
  };

  // Fetch items when page changes
  useEffect(() => {
    fetchItems(page);
  }, [page]);

  const renderItem = useCallback(
    ({ item }: any) => {
      const statusStyle = {
        backgroundColor: getBackgroundColor(item.status),
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginTop: 10,
      };

      const statusTextStyle = {
        color: '#fff', // White text for better contrast
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'capitalize',
      };

      return (
        <View style={[styles.card, { width: width - 40 }]}>
          <Text style={styles.subject}>{item.subject}</Text>
          <View style={statusStyle}>
            <Text style={statusTextStyle}>{item.status}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          >
            <Icon name="eye" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      );
    },
    [width],
  );

  const renderFooter = () => {
    if (!loading || !hasMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} color="#4A90E2" />;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No leave requests found.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add Leave Request Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setLeaveRequestModalVisible(true)}>
        <Text style={styles.addButtonText}>Request Leave</Text>
      </TouchableOpacity>

      {/* Leave Request Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={leaveRequestModalVisible}
        onRequestClose={() => setLeaveRequestModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setLeaveRequestModalVisible(false)}>
                <Icon name="times" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            <LeaveRequestForm onSubmit={handleLeaveRequestSubmit} />
          </View>
        </View>
      </Modal>

      {/* List of Leave Requests */}
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshItems}
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
      />

      {/* Modal for Viewing Leave Request Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setModalVisible(false)}>
                <Icon name="times" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            {selectedItem && (
              <ScrollView>
                <Text style={styles.modalText}>Subject: {selectedItem.subject}</Text>
                <Text style={styles.modalText}>Reason: {selectedItem.reason}</Text>
                <Text style={styles.modalText}>
                  From: {new Date(selectedItem.dateRange.start).toLocaleString()}
                </Text>
                <Text style={styles.modalText}>
                  To: {new Date(selectedItem.dateRange.end).toLocaleString()}
                </Text>
                <View style={[styles.statusContainer, { backgroundColor: getBackgroundColor(selectedItem.status) }]}>
                  <Text style={[styles.statusText, { color: '#fff' }]}>
                    {selectedItem.status}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c2c', // Dark background
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#2c2c3c', // Dark card background
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: 'relative',
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  statusContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa', // Light gray for empty state
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#2c2c3c', // Dark modal background
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeIcon: {
    padding: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 16,
    color: '#fff', // White text
  },
  addButton: {
    backgroundColor: '#4A90E2', // Blue button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyList;