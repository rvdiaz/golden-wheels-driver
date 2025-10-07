import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import {
  Calendar,
  Home,
  Users,
  Plus,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Send,
  Eye,
} from 'lucide-react-native';
import {
  mockIncomingRequests,
  mockMyBookings,
  mockMyListings,
  mockOpenHouses,
  OpenHouse,
  OpenHouseBooking,
} from './mockedData';

export const OpenHousesPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'create' | 'browse' | 'manage'>('create');

  // Create form state
  const [address, setAddress] = useState('');
  const [mlsNumber, setMlsNumber] = useState('');
  const [description, setDescription] = useState('');

  // Booking form state
  const [selectedOpenHouse, setSelectedOpenHouse] = useState<OpenHouse | null>(null);
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  // Mock data (will be replaced with Apollo queries)
  const [openHouses] = useState<OpenHouse[]>(mockOpenHouses);
  const [myListings] = useState<OpenHouse[]>(mockMyListings);
  const [myBookings] = useState<OpenHouseBooking[]>(mockMyBookings);
  const [incomingRequests] = useState<OpenHouseBooking[]>(mockIncomingRequests);

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOpenHouse = async () => {
    if (!address.trim() || !mlsNumber.trim()) {
      alert('Please enter both address and MLS number.');
      return;
    }

    setIsLoading(true);
    // TODO: Replace with Apollo mutation
    setTimeout(() => {
      setIsLoading(false);
      alert('Open house listing created successfully!');
      setAddress('');
      setMlsNumber('');
      setDescription('');
      setActiveTab('browse');
    }, 1000);
  };

  const handleRequestBooking = async (openHouseId: number) => {
    if (!requestedDate || !requestedTime) {
      alert('Please select both date and time for your booking request.');
      return;
    }

    setIsLoading(true);
    // TODO: Replace with Apollo mutation
    setTimeout(() => {
      setIsLoading(false);
      alert('Booking request sent successfully!');
      setSelectedOpenHouse(null);
      setRequestedDate('');
      setRequestedTime('');
      setRequestMessage('');
    }, 1000);
  };

  const handleBookingResponse = async (bookingId: number, status: 'approved' | 'rejected') => {
    setIsLoading(true);
    // TODO: Replace with Apollo mutation
    setTimeout(() => {
      setIsLoading(false);
      alert(`Booking request ${status} successfully!`);
    }, 1000);
  };

  const renderTabButton = (tab: 'create' | 'browse' | 'manage', label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}>
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBadge = (
    text: string,
    variant: 'default' | 'success' | 'warning' | 'danger' = 'default'
  ) => {
    const badgeStyle = [
      styles.badge,
      variant === 'success' && styles.badgeSuccess,
      variant === 'warning' && styles.badgeWarning,
      variant === 'danger' && styles.badgeDanger,
    ];
    const textStyle = [
      styles.badgeText,
      variant === 'success' && styles.badgeTextSuccess,
      variant === 'warning' && styles.badgeTextWarning,
      variant === 'danger' && styles.badgeTextDanger,
    ];

    return (
      <View style={badgeStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    );
  };

  const renderCreateTab = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Plus color="#7c3aed" size={20} />
        <Text style={styles.cardTitle}>Create Open House Listing</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Address</Text>
          <TextInput
            style={styles.input}
            placeholder="123 Main Street, City, State, ZIP"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>MLS Number</Text>
          <TextInput
            style={styles.input}
            placeholder="MLS123456"
            value={mlsNumber}
            onChangeText={setMlsNumber}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Brief description of the property and any special features..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleCreateOpenHouse}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Plus color="#fff" size={16} />
              <Text style={styles.buttonText}>Create Open House Listing</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBrowseTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Available Open House Listings</Text>
        {renderBadge(`${openHouses.length} Properties`)}
      </View>

      {openHouses.length === 0 ? (
        <View style={styles.emptyState}>
          <Home color="#9ca3af" size={48} />
          <Text style={styles.emptyStateText}>No open house listings available yet.</Text>
          <Text style={styles.emptyStateSubtext}>Create the first listing to get started.</Text>
        </View>
      ) : (
        openHouses.map((openHouse) => (
          <View key={openHouse.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.listingHeader}>
                <View style={styles.flex1}>
                  <View style={styles.row}>
                    <MapPin color="#6b7280" size={16} />
                    <Text style={styles.listingAddress}>{openHouse.address}</Text>
                  </View>
                  <View style={styles.listingMeta}>
                    <View style={styles.row}>
                      <FileText color="#6b7280" size={14} />
                      <Text style={styles.metaText}>{openHouse.mlsNumber}</Text>
                    </View>
                    <View style={styles.row}>
                      <Users color="#6b7280" size={14} />
                      <Text style={styles.metaText}>{openHouse.publisherName}</Text>
                    </View>
                  </View>
                  {openHouse.description && (
                    <Text style={styles.listingDescription}>{openHouse.description}</Text>
                  )}
                </View>
                {renderBadge('Available')}
              </View>

              {selectedOpenHouse?.id === openHouse.id ? (
                <View style={styles.bookingForm}>
                  <Text style={styles.bookingFormTitle}>Request Open House Time Slot</Text>
                  <View style={styles.inputRow}>
                    <View style={styles.inputHalf}>
                      <Text style={styles.label}>Preferred Date</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={requestedDate}
                        onChangeText={setRequestedDate}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View style={styles.inputHalf}>
                      <Text style={styles.label}>Preferred Time</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="HH:MM"
                        value={requestedTime}
                        onChangeText={setRequestedTime}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Message to Publisher (Optional)</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Any additional notes or special requests..."
                      value={requestMessage}
                      onChangeText={setRequestMessage}
                      multiline
                      numberOfLines={3}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonPrimary, styles.buttonFlex]}
                      onPress={() => handleRequestBooking(openHouse.id)}
                      disabled={isLoading}>
                      {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Send color="#fff" size={16} />
                          <Text style={styles.buttonText}>Send Request</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonOutline, styles.buttonFlex]}
                      onPress={() => setSelectedOpenHouse(null)}>
                      <Text style={styles.buttonOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline, styles.mt16]}
                  onPress={() => setSelectedOpenHouse(openHouse)}>
                  <Calendar color="#7c3aed" size={16} />
                  <Text style={styles.buttonOutlineText}>Request Time Slot</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderManageTab = () => (
    <View style={styles.tabContent}>
      {/* Incoming Requests */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Eye color="#7c3aed" size={20} />
          <Text style={styles.cardTitle}>Incoming Requests</Text>
          {renderBadge(
            `${incomingRequests.filter((r) => r.status === 'pending').length} Pending`,
            'warning'
          )}
        </View>
        <View style={styles.cardContent}>
          {incomingRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Eye color="#9ca3af" size={48} />
              <Text style={styles.emptyStateText}>No incoming requests yet.</Text>
              <Text style={styles.emptyStateSubtext}>
                Requests from other agents will appear here.
              </Text>
            </View>
          ) : (
            incomingRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View>
                    <Text style={styles.requestAddress}>{request.address}</Text>
                    <Text style={styles.requestMeta}>Requested by: {request.requesterName}</Text>
                    <Text style={styles.requestMeta}>
                      Date: {new Date(request.requestedDate).toLocaleDateString()} at{' '}
                      {request.requestedTime}
                    </Text>
                  </View>
                  {renderBadge(
                    request.status.charAt(0).toUpperCase() + request.status.slice(1),
                    request.status === 'approved'
                      ? 'success'
                      : request.status === 'rejected'
                        ? 'danger'
                        : 'warning'
                  )}
                </View>
                {request.message && <Text style={styles.requestMessage}>"{request.message}"</Text>}
                {request.status === 'pending' && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonSuccess, styles.buttonFlex]}
                      onPress={() => handleBookingResponse(request.id, 'approved')}
                      disabled={isLoading}>
                      <CheckCircle color="#fff" size={16} />
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonDanger, styles.buttonFlex]}
                      onPress={() => handleBookingResponse(request.id, 'rejected')}
                      disabled={isLoading}>
                      <XCircle color="#fff" size={16} />
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {request.responseMessage && (
                  <View style={styles.responseBox}>
                    <Text style={styles.responseText}>
                      <Text style={styles.bold}>Response:</Text> {request.responseMessage}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </View>

      {/* My Requests */}
      <View style={[styles.card, styles.mt16]}>
        <View style={styles.cardHeader}>
          <Send color="#7c3aed" size={20} />
          <Text style={styles.cardTitle}>My Requests</Text>
        </View>
        <View style={styles.cardContent}>
          {myBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar color="#9ca3af" size={48} />
              <Text style={styles.emptyStateText}>
                You haven't made any open house requests yet.
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Browse available listings to request time slots.
              </Text>
            </View>
          ) : (
            myBookings.map((booking) => (
              <View key={booking.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View>
                    <Text style={styles.requestAddress}>{booking.address}</Text>
                    <Text style={styles.requestMeta}>Property owner: {booking.publisherName}</Text>
                    <Text style={styles.requestMeta}>
                      Requested: {new Date(booking.requestedDate).toLocaleDateString()} at{' '}
                      {booking.requestedTime}
                    </Text>
                  </View>
                  {renderBadge(
                    booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
                    booking.status === 'approved'
                      ? 'success'
                      : booking.status === 'rejected'
                        ? 'danger'
                        : 'warning'
                  )}
                </View>
                {booking.message && (
                  <View style={styles.messageBox}>
                    <Text style={styles.messageText}>
                      <Text style={styles.bold}>Your message:</Text> {booking.message}
                    </Text>
                  </View>
                )}
                {booking.responseMessage && (
                  <View style={styles.responseBox}>
                    <Text style={styles.responseText}>
                      <Text style={styles.bold}>Response:</Text> {booking.responseMessage}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );

  return (
    <PageSafeContainer>
      <Header
        title="Open Houses"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.banner}>
          <Calendar color="#7c3aed" size={24} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Open House Coordination</Text>
            <Text style={styles.bannerSubtitle}>
              Create listings and coordinate open house schedules with other agents
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {renderTabButton('create', 'Create Listing')}
          {renderTabButton('browse', 'Browse Listings')}
          {renderTabButton('manage', 'Manage')}
        </View>

        {/* Tab Content */}
        {activeTab === 'create' && renderCreateTab()}
        {activeTab === 'browse' && renderBrowseTab()}
        {activeTab === 'manage' && renderManageTab()}
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5b21b6',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#7c3aed',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#111827',
  },
  tabContent: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  cardContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonPrimary: {
    backgroundColor: '#7c3aed',
  },
  buttonSuccess: {
    backgroundColor: '#16a34a',
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonOutlineText: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonFlex: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  badgeTextSuccess: {
    color: '#16a34a',
  },
  badgeTextWarning: {
    color: '#ca8a04',
  },
  badgeTextDanger: {
    color: '#dc2626',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listingAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  listingMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  listingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  bookingForm: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    gap: 16,
  },
  bookingFormTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  mt16: {
    marginTop: 16,
  },
  requestCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  requestAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  requestMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  requestMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  messageBox: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 13,
    color: '#4b5563',
  },
  responseBox: {
    backgroundColor: '#f5f3ff',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  responseText: {
    fontSize: 13,
    color: '#5b21b6',
  },
  bold: {
    fontWeight: '600',
  },
});
