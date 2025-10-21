import React, { useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
  SafeAreaView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const needHelpData = [
  {
    id: '1',
    name: 'Aryan Sharma',
    contact: '9876543210',
    date: '2 Oct 2024',
    location: 'Parcel Area',
    offeredmoney: '20',
  },
  {
    id: '2',
    name: 'Megha Rathi',
    date: '2 Oct 2024',
    contact: '9988776655',
    location: 'Mayuri Cafe',
    offeredmoney: '20',
  },
];

const canHelpData = [
  {
    id: '1',
    fullName: 'Varun Kushwah',
    contactNumber: '7697131464',
    date: '2 Oct 2024',
    timeSlot: { start: '14:00', end: '15:00' },
    deliveryCharge: 20,
    availableLocation: 'Mayuri Cafe',
  },
  {
    id: '2',
    fullName: 'Shreyash Neeraj',
    contactNumber: '9989989898',
    date: '2 Oct 2024',
    timeSlot: { start: '14:00', end: '15:00' },
    deliveryCharge: 20,
    availableLocation: 'AB Dakshin',
  },
];

export default function DeliBuddyScreen() {
  const [activeTab, setActiveTab] = useState('need'); // 'need' or 'can'
  const [needHelp, setNeedHelp] = useState(needHelpData);
  const [canHelp, setCanHelp] = useState(canHelpData);

  // Need Help form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [offeredmoney, setOfferedmoney] = useState('');
  const [contact, setContact] = useState('');

  // Can Help form states
  const [fullName, setFullName] = useState('');
  const [availableLocation, setAvailableLocation] = useState('');
  const [helpDate, setHelpDate] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '70%'], []);

  const openSheet = () => bottomSheetRef.current?.expand();
  const closeSheet = () => bottomSheetRef.current?.close();

  const handleNeedHelpSubmit = () => {
    if (!name.trim() || !location.trim() || !date.trim() || !offeredmoney.trim() || !contact.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name,
      location,
      date,
      offeredmoney,
      contact,
    };
    setNeedHelp([newItem, ...needHelp]);
    setName('');
    setLocation('');
    setDate('');
    setOfferedmoney('');
    setContact('');
    closeSheet();
  };

  const handleCanHelpSubmit = () => {
    if (!fullName.trim() || !availableLocation.trim() || !helpDate.trim() || 
        !timeStart.trim() || !timeEnd.trim() || !deliveryCharge.trim() || !contactNumber.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      fullName,
      availableLocation,
      date: helpDate,
      timeSlot: { start: timeStart, end: timeEnd },
      deliveryCharge,
      contactNumber,
    };
    setCanHelp([newItem, ...canHelp]);
    setFullName('');
    setAvailableLocation('');
    setHelpDate('');
    setTimeStart('');
    setTimeEnd('');
    setDeliveryCharge('');
    setContactNumber('');
    closeSheet();
  };

  const handleMessage = (phoneNumber) => {
    const url = `sms:${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error('Error opening SMS:', err));
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderNeedHelpCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.moneyBadge}>
            <Ionicons name="cash-outline" size={12} color="#10b981" />
            <Text style={styles.moneyText}>₹{item.offeredmoney}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.messageBtn}
          onPress={() => handleMessage(item.contact)}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#444" />
          <Text style={styles.infoLabel}>Pickup Location</Text>
        </View>
        <Text style={styles.infoValue}>{item.location}</Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#444" />
          <Text style={styles.infoLabel}>Date</Text>
        </View>
        <Text style={styles.infoValue}>{item.date}</Text>
      </View>
    </View>
  );

  const renderCanHelpCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.fullName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.name}>{item.fullName}</Text>
          <View style={styles.moneyBadge}>
            <Ionicons name="cash-outline" size={12} color="#10b981" />
            <Text style={styles.moneyText}>₹{item.deliveryCharge}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.messageBtn}
          onPress={() => handleMessage(item.contactNumber)}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#444" />
          <Text style={styles.infoLabel}>Available Location</Text>
        </View>
        <Text style={styles.infoValue}>{item.availableLocation}</Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#444" />
          <Text style={styles.infoLabel}>Time Slot</Text>
        </View>
        <Text style={styles.infoValue}>
          {formatTime(item.timeSlot.start)} - {formatTime(item.timeSlot.end)}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#444" />
          <Text style={styles.infoLabel}>Date</Text>
        </View>
        <Text style={styles.infoValue}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'need' && styles.activeTab]}
              onPress={() => setActiveTab('need')}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="help-circle-outline" 
                size={20} 
                color={activeTab === 'need' ? '#fff' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'need' && styles.activeTabText]}>
                I Need Help
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'can' && styles.activeTab]}
              onPress={() => setActiveTab('can')}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="hand-left-outline" 
                size={20} 
                color={activeTab === 'can' ? '#fff' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'can' && styles.activeTabText]}>
                I Can Help
              </Text>
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={activeTab === 'need' ? needHelp : canHelp}
            keyExtractor={(item) => item.id}
            renderItem={activeTab === 'need' ? renderNeedHelpCard : renderCanHelpCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Floating Action Button */}
          <Pressable style={styles.fab} onPress={openSheet}>
            <Ionicons name="add" size={24} color="#fff" />
          </Pressable>

          {/* Bottom Sheet */}
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
          >
            <BottomSheetView style={styles.sheetContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {activeTab === 'need' ? (
                  <>
                    <Text style={styles.modalHeading}>Request Help</Text>

                    <View style={styles.inputContainer}>
                      <Ionicons name="person-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Your Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="location-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Pickup Location"
                        value={location}
                        onChangeText={setLocation}
                        style={styles.input}
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="calendar-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Date (e.g., 2 Oct 2024)"
                        value={date}
                        onChangeText={setDate}
                        style={styles.input}
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="cash-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Offered Amount (₹)"
                        value={offeredmoney}
                        onChangeText={setOfferedmoney}
                        style={styles.input}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="call-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Contact Number"
                        value={contact}
                        keyboardType="phone-pad"
                        onChangeText={setContact}
                        style={styles.input}
                        placeholderTextColor="#999"
                      />
                    </View>

                    <Pressable style={styles.submitButton} onPress={handleNeedHelpSubmit}>
                      <Text style={styles.submitText}>Submit Request</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalHeading}>Offer Help</Text>

                    <View style={styles.inputContainer}>
                      <Ionicons name="person-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Your Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.input}
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="location-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Available Location"
                        value={availableLocation}
                        onChangeText={setAvailableLocation}
                        style={styles.input}
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="calendar-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Date (e.g., 2 Oct 2024)"
                        value={helpDate}
                        onChangeText={setHelpDate}
                        style={styles.input}
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.timeRow}>
                      <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                        <Ionicons name="time-outline" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                          placeholder="Start (14:00)"
                          value={timeStart}
                          onChangeText={setTimeStart}
                          style={styles.input}
                          placeholderTextColor="#999"
                        />
                      </View>

                      <View style={[styles.inputContainer, { flex: 1 }]}>
                        <Ionicons name="time-outline" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                          placeholder="End (15:00)"
                          value={timeEnd}
                          onChangeText={setTimeEnd}
                          style={styles.input}
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="cash-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Delivery Charge (₹)"
                        value={deliveryCharge}
                        onChangeText={setDeliveryCharge}
                        style={styles.input}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="call-outline" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Contact Number"
                        value={contactNumber}
                        keyboardType="phone-pad"
                        onChangeText={setContactNumber}
                        style={styles.input}
                        placeholderTextColor="#999"
                      />
                    </View>

                    <Pressable style={styles.submitButton} onPress={handleCanHelpSubmit}>
                      <Text style={styles.submitText}>Submit Offer</Text>
                    </Pressable>
                  </>
                )}
              </ScrollView>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  card: {
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  moneyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moneyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  messageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  infoValue: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    height: 52,
    width: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});