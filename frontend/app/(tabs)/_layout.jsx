import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import { useFonts, Vibur_400Regular } from '@expo-google-fonts/vibur';

const Drawer = createDrawerNavigator();
const userFile = FileSystem.documentDirectory + 'user.json';

// ---------- Custom Drawer ----------
function CustomDrawerContent(props) {
  const { signOut } = useClerk();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(userFile);
        if (fileInfo.exists) {
          const data = await FileSystem.readAsStringAsync(userFile);
          setUserInfo(JSON.parse(data));
        }
      } catch (err) {
        console.error('Error reading user.json:', err);
      }
    };
    loadUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL('/(auth)/sign-in'));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>
          Hey {userInfo?.name || 'User'}
        </Text>
      </View>
      <DrawerItem
        label="Settings"
        icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('settings')}
      />
      <DrawerItem
        label="Meet Developers"
        icon={({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('developers')}
      />
      <DrawerItem
        label="Sign Out"
        icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
        onPress={handleSignOut}
      />
    </DrawerContentScrollView>
  );
}

// ---------- Tabs Layout ----------
function TabsLayout() {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Vibur_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleStyle: { fontSize: 18, fontWeight: '700', color: '#000' },
        headerStyle: { backgroundColor: '#fff' },
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>
        ),
        tabBarStyle: Platform.select({
          ios: { position: 'absolute', backgroundColor: '#fff' },
          default: { backgroundColor: '#fff' },
        }),
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'academia') iconName = focused ? 'school' : 'school-outline';
          if (route.name === 'hostelnmess') iconName = focused ? 'restaurant' : 'restaurant-outline';
          if (route.name === 'socialsphere') iconName = focused ? 'people' : 'people-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ headerTitle: () => {
        return <Text style={{ fontFamily: 'Vibur_400Regular', fontSize: 32, marginStart: 32 }}>VITBuddy</Text>;
      }}} />
      <Tabs.Screen name="socialsphere" options={{ headerTitle: () => {
        return <Text style={{ fontFamily: 'Vibur_400Regular', fontSize: 32, marginStart: 32 }}>Social Sphere</Text>;
      }  }} />
      <Tabs.Screen name="hostelnmess" options={{ headerTitle: () => {
        return <Text style={{ fontFamily: 'Vibur_400Regular', fontSize: 32, marginStart: 32 }}>Hostel & Mess</Text>;
      } }} />
      <Tabs.Screen name="academia" options={{ headerTitle: () => {
        return <Text style={{ fontFamily: 'Vibur_400Regular', fontSize: 32, marginStart: 32 }}>Academia</Text>;
      } }} />
    </Tabs>
  );
}

// ---------- Root Layout ----------
export default function RootLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="main" component={TabsLayout} />
      <Drawer.Screen name="settings" component={() => <Text>Settings Screen</Text>} />
      <Drawer.Screen name="developers" component={() => <Text>Meet Developers Screen</Text>} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({});
