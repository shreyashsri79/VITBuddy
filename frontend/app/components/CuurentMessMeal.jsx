import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import messData from '../../assets/jsons/mess.json';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

const userFile = FileSystem.documentDirectory + 'user.json';

const getCurrentMealAndDay = () => {
  const now = new Date();
  const hour = now.getHours();
  const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  let todayIndex = now.getDay();
  let meal = '';

  if (hour >= 0 && hour < 9) meal = 'breakfast';
  else if (hour >= 9 && hour < 14) meal = 'lunch';
  else if (hour >= 14 && hour < 18) meal = 'snacks';
  else if (hour >= 18 && hour < 21) meal = 'dinner';
  else {
    meal = 'breakfast';
    todayIndex = (todayIndex + 1) % 7;
  }

  return { today: daysOfWeek[todayIndex], meal };
};

const CurrentMenu = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { today, meal } = getCurrentMealAndDay();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(userFile);
        if (fileInfo.exists) {
          const data = await FileSystem.readAsStringAsync(userFile);
          setUserData(JSON.parse(data));
        }
      } catch (err) {
        console.error('Error reading user.json:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  }

  if (!userData?.mess) {
    return (
      <View style={styles.container}>
        <Text style={styles.noData}>No mess selected. Please update your profile.</Text>
      </View>
    );
  }

  const messName = userData.mess;
  const content = messData?.messMenus?.[messName]?.days?.[today]?.[meal];

  return (
    <Pressable onPress={() => router.push('/(tabs)/hostelnmess/mess')}>
      <View style={styles.container}>
        <Text style={styles.messLabel}>
          Mess: {messName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Text>

        <Text style={styles.heading}>
          {meal.charAt(0).toUpperCase() + meal.slice(1)} - {today}
        </Text>

        {content ? (
          <Text style={styles.menuText}>{content}</Text>
        ) : (
          <Text style={styles.noData}>Menu not available.</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    margin: 16,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  messLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'center',
  },
  noData: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default CurrentMenu;
