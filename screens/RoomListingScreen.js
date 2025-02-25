import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// API endpoint
const ROOM_AVAILABILITY_URL =
  'https://gist.githubusercontent.com/yuhong90/7ff8d4ebad6f759fcc10cc6abdda85cf/raw/463627e7d2c7ac31070ef409d29ed3439f7406f6/room-availability.json';

const RoomListingScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format date for display (e.g. "3 Jan 2019")
  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Format time for display (e.g. "12:30 PM")
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle date selection
  const onChangeDate = (event, newDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (newDate) {
      // Keep the time portion from the previously selectedDate
      const updated = new Date(selectedDate);
      updated.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      setSelectedDate(updated);
    }
  };

  // Handle time selection
  const onChangeTime = (event, newTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (newTime) {
      // Keep the date portion from the previously selectedDate
      const updated = new Date(selectedDate);
      updated.setHours(newTime.getHours(), newTime.getMinutes());
      setSelectedDate(updated);
    }
  };

  // Fetch room data from API
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(ROOM_AVAILABILITY_URL);
      const data = await response.json();

      // Sort rooms by level ascending (e.g., "Level 7" => parse out '7')
      const sortedRooms = data.sort((a, b) => {
        const levelA = parseInt(a.location.replace(/\D/g, ''), 10);
        const levelB = parseInt(b.location.replace(/\D/g, ''), 10);
        return levelA - levelB;
      });

      setRooms(sortedRooms);
    } catch (err) {
      setError('Failed to fetch room data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Determine availability based on selected time slot
  // The API data has availability in the format "HH:00": 0 or 1
  const getAvailabilityText = (item) => {
    // Extract the hour from the selected date
    const hour = selectedDate.getHours().toString().padStart(2, '0');
    const timeKey = `${hour}:00`;

    // If item.availability[timeKey] == 1 => Available; else Not Available
    const isAvailable = item.availability?.[timeKey] === 1;
    return isAvailable ? 'Available' : 'Not Available';
  };

  // Render each room item
  const renderRoomItem = ({ item }) => {
    const availabilityText = getAvailabilityText(item);
    return (
      <View style={styles.roomCard}>
        <Text style={styles.roomName}>{item.room_name}</Text>
        <Text style={styles.roomDetails}>{item.location}</Text>
        <Text style={styles.roomDetails}>{`${item.capacity} Pax`}</Text>
        <Text style={[styles.roomDetails, availabilityText === 'Available' ? styles.available : styles.notAvailable]}>
          {availabilityText}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Room</Text>

      {/* Date & Time Selection */}
      <View style={styles.dateTimeRow}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
          <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
          <Text style={styles.dateTimeText}>{formatTime(selectedDate)}</Text>
        </TouchableOpacity>
      </View>

      {/* Native Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Native Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      {/* Fetch Rooms Button */}
      <View style={styles.buttonContainer}>
        <Button title="Search" onPress={fetchRooms} />
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 16 }} />}

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Room Listing */}
      <FlatList
        data={rooms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRoomItem}
        style={{ marginTop: 16 }}
      />
    </View>
  );
};

export default RoomListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  roomCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roomDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  available: {
    color: 'green',
  },
  notAvailable: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
});
