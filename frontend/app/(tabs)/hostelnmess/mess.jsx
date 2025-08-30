import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as FileSystem from 'expo-file-system';
import messData from '../../../assets/jsons/mess.json';

const userFile = FileSystem.documentDirectory + 'user.json';

const MessScreen = () => {
  const [open, setOpen] = useState(false);
  const [selectedMess, setSelectedMess] = useState(null);

  // Load user.json to get default mess
  useEffect(() => {
    const loadUser = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(userFile);
        if (fileInfo.exists) {
          const data = await FileSystem.readAsStringAsync(userFile);
          const parsed = JSON.parse(data);
          if (parsed?.mess && messData.messMenus[parsed.mess]) {
            setSelectedMess(parsed.mess);
          } else {
            setSelectedMess('mayuri_boys'); // fallback if invalid
          }
        } else {
          setSelectedMess('mayuri_boys'); // fallback if file missing
        }
      } catch (err) {
        console.error('Error loading user.json:', err);
        setSelectedMess('mayuri_boys');
      }
    };
    loadUser();
  }, []);

  // Dropdown items
  const messOptions = Object.keys(messData.messMenus).map((messKey) => ({
    label: messKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    value: messKey,
  }));

  if (!selectedMess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Day logic
  const daysOfWeek = [
    'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
  ];
  const todayIndex = new Date().getDay();
  const today = daysOfWeek[todayIndex];

  const allDays = Object.keys(messData.messMenus[selectedMess].days);
  const todayPos = allDays.indexOf(today);
  const reorderedDays =
    todayPos === -1
      ? allDays
      : [...allDays.slice(todayPos), ...allDays.slice(0, todayPos)];

  const menuData = reorderedDays.map((day) => ({
    day,
    data: messData.messMenus[selectedMess].days[day],
  }));

  const renderItem = ({ item }) => (
    <View style={styles.dayCard}>
      <Text style={styles.dayTitle}>{item.day}</Text>

      <View style={styles.mealBox}>
        <Text style={styles.mealTitle}>🍳 Breakfast</Text>
        <Text style={styles.meal}>{item.data.breakfast}</Text>
      </View>

      <View style={styles.mealBox}>
        <Text style={styles.mealTitle}>🍛 Lunch</Text>
        <Text style={styles.meal}>{item.data.lunch}</Text>
      </View>

      <View style={styles.mealBox}>
        <Text style={styles.mealTitle}>🍟 Snacks</Text>
        <Text style={styles.meal}>{item.data.snacks}</Text>
      </View>

      <View style={styles.mealBox}>
        <Text style={styles.mealTitle}>🍲 Dinner</Text>
        <Text style={styles.meal}>{item.data.dinner}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Mess selector */}
        <DropDownPicker
          open={open}
          value={selectedMess}
          items={messOptions}
          setOpen={setOpen}
          setValue={setSelectedMess}
          placeholder="Select Mess"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        {/* Menu list */}
        <FlatList
          data={menuData}
          renderItem={renderItem}
          keyExtractor={(item) => item.day}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { flex: 1, padding: 16 },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  dayCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  mealBox: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#444' },
  meal: { fontSize: 14, color: '#555', lineHeight: 20 },
});

export default MessScreen;
