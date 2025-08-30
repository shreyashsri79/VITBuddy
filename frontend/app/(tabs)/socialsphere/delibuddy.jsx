// Imports
import React, { useRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { useFonts, Tinos_700Bold } from '@expo-google-fonts/tinos';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const requests = [
  {
    id: '1',
    name: 'Aryan Sharma',
    note: 'Hey! My classes go on till 6PM 😓 Can someone please bring my parcel? It’s prepaid!',
    contact: '9876543210',
  },
  {
    id: '2',
    name: 'Megha Rathi',
    note: 'Need help collecting my Zudio package 🙈 I’m out of campus for a seminar.',
    contact: '9988776655',
  },
  {
    id: '3',
    name: 'Yash Jindal',
    note: 'Amazon delivery expected by 4PM. I’ll treat you to chai ☕ if you can pick it up!',
    contact: '9012345678',
  },
  {
    id: '4',
    name: 'Tanvi Nair',
    note: 'Stuck in lab 😩 Anyone passing by the hostel gate, please grab my parcel?',
    contact: '7890123456',
  },
];

export default function DeliBuddyScreen() {
  const [fontsLoaded] = useFonts({ Tinos_700Bold });
  const [data, setData] = useState(requests);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [contact, setContact] = useState('');

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '60%'], []);

  if (!fontsLoaded) return null;

  const openSheet = () => bottomSheetRef.current?.expand();
  const closeSheet = () => bottomSheetRef.current?.close();

  const handleSubmit = () => {
    if (!name.trim() || !note.trim() || !contact.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name,
      note,
      contact,
    };
    setData([newItem, ...data]);
    setName('');
    setNote('');
    setContact('');
    closeSheet();
  };

  const renderRequest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.note}>{item.note}</Text>
      <Text style={styles.contact}>📱 {item.contact}</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>DeliBuddy</Text>
        <View style={styles.divider} />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
          contentContainerStyle={styles.listContainer}
        />

        {/* Floating Action Button */}
        <Pressable style={styles.fab} onPress={openSheet}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>

        {/* Bottom Sheet */}
        <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
          <BottomSheetView style={styles.sheetContent}>
            <ScrollView>
              <Text style={styles.modalHeading}>Add New Request</Text>

              <TextInput
                placeholder="Your Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Request Note"
                value={note}
                onChangeText={setNote}
                style={styles.input}
              />
              <TextInput
                placeholder="Contact Number"
                value={contact}
                keyboardType="phone-pad"
                onChangeText={setContact}
                style={styles.input}
              />

              <Pressable style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </Pressable>
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: '#fafafa',
  },
  heading: {
    fontSize: 36,
    fontFamily: 'Tinos_700Bold',
    paddingHorizontal: 20,
    marginBottom: 10,
    color: '#111',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dotted',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },
  note: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  contact: {
    fontSize: 13,
    color: '#444',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    elevation: 6,
  },
  sheetContent: {
    flex: 1,
    padding: 20,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
