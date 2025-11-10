import { useState } from 'react';
import { OpenHouseListing, OpenHouseListingStatus } from '../interfaces';
import { Calendar, FileText, MapPin, Send, Users, XCircle } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { ActivityIndicator, TouchableOpacity, StyleSheet, View } from 'react-native';
import { userData } from '~/store/user';
import { useReactiveVar } from '@apollo/client';
import { Badge } from './badge';
import { theme } from '~/theme/theme';

interface IOpenHouseListingProps {
  listing: OpenHouseListing;
  onRequestBooking: (
    listingId: OpenHouseListing,
    requestedDate: string,
    requestedTime: string,
    requestMessage: string
  ) => Promise<boolean>;
  onDeleteListing: (listingId: string) => Promise<boolean>;
  selected: boolean;
  setSelected: (listing: OpenHouseListing | null) => void;
  isLoading?: boolean;
}

export const OpenHouseListingCard = (props: IOpenHouseListingProps) => {
  const { listing, onRequestBooking, onDeleteListing, isLoading, selected, setSelected } = props;
  const user = useReactiveVar(userData);

  const [requestMessage, setRequestMessage] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const primaryColor = theme?.colors.primary;

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const hadError = await onDeleteListing(id);
    if (!hadError) {
      setConfirmingDelete(false);
    }
    setIsDeleting(false);
  };

  const handleRequestBooking = async () => {
    const hadError = await onRequestBooking(listing, requestedDate, requestedTime, requestMessage);
    if (hadError) {
      return;
    }
    setRequestedDate('');
    setRequestedTime('');
    setRequestMessage('');
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.listingHeader}>
          <View style={styles.flex1}>
            <View style={styles.row}>
              <MapPin color="#6b7280" size={16} />
              <Text style={styles.listingAddress}>{listing.address}</Text>
            </View>
            <View style={styles.listingMeta}>
              <View style={styles.row}>
                <FileText color="#6b7280" size={14} />
                <Text style={styles.metaText}>{listing.mlsNumber}</Text>
              </View>
              <View style={styles.row}>
                <Users color="#6b7280" size={14} />
                <Text style={styles.metaText}>{listing.mlsAgentFullName}</Text>
              </View>
            </View>
            {listing.description && (
              <Text style={styles.listingDescription}>{listing.description}</Text>
            )}
          </View>
          <View>
            {listing.status === OpenHouseListingStatus.ACTIVE ? (
              <Badge text="Available" variant="success" />
            ) : (
              <Badge text="Unavailable" variant="warning" />
            )}
          </View>
        </View>

        {!!selected ? (
          <View style={styles.bookingForm}>
            <Text style={styles.bookingFormTitle}>Request Open House Time Slot</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Preferred Date</Text>
                <InputField
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={requestedDate}
                  onChangeText={setRequestedDate}
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Preferred Time</Text>
                <InputField
                  style={styles.input}
                  placeholder="HH:MM"
                  value={requestedTime}
                  onChangeText={setRequestedTime}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
            <View>
              <Text style={styles.label}>Message to Publisher (Optional)</Text>
              <InputField
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
                onPress={() => handleRequestBooking()}
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
                onPress={() => setSelected(null)}>
                <Text style={styles.buttonOutlineText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : user?.id !== listing.ownerId && listing.status === OpenHouseListingStatus.ACTIVE ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline, styles.mt16]}
            onPress={() => setSelected(listing)}>
            <Calendar color={primaryColor} size={16} />
            <Text style={styles.buttonOutlineText}>Request Time Slot</Text>
          </TouchableOpacity>
        ) : (
          // <TouchableOpacity
          //   style={[styles.button, styles.buttonOutline, styles.mt16]}
          //   onPress={() => {}}>
          //   <Pencil color={primaryColor} size={16} />
          //   <Text style={styles.buttonOutlineText}>Edit Your Listing</Text>
          // </TouchableOpacity>
          <>
            {!confirmingDelete && user?.id === listing.ownerId && (
              <TouchableOpacity
                style={[styles.button, styles.buttonDanger, styles.buttonFlex]}
                onPress={() => setConfirmingDelete(true)}
                disabled={isDeleting}>
                <XCircle color="#fff" size={16} />
                <Text style={styles.buttonText}>Delete Listing</Text>
              </TouchableOpacity>
            )}
            {!!confirmingDelete && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonDanger, styles.buttonFlex]}
                  onPress={() => handleDelete(listing.id)}
                  disabled={isDeleting}>
                  <XCircle color="#fff" size={16} />
                  <Text style={styles.buttonText}>Confirm Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline, styles.buttonFlex]}
                  onPress={() => setConfirmingDelete(false)}
                  disabled={isDeleting}>
                  <Text style={styles.buttonOutlineText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </View>
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
    color: theme.colors.primary,
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
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.primary,
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
