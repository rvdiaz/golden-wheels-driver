import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { OpenHouseVisitRequest, OpenHouseVisitRequestStatus } from '../interfaces';
import Text from '~/codidge_components/UI/text';
import { Badge } from './badge';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { theme } from '~/theme/theme';

interface IncomingBookingProps {
  request: OpenHouseVisitRequest;
  handleBookingResponse: (
    requestId: string,
    status: OpenHouseVisitRequestStatus,
    response: string
  ) => Promise<boolean>;
  selected: boolean;
  setSelected: (id: string | null) => void;
}

export const IncomingBooking = (props: IncomingBookingProps) => {
  const { request, handleBookingResponse, selected, setSelected } = props;

  const [response, setResponse] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: OpenHouseVisitRequestStatus) => {
    setIsLoading(true);
    const hadError = await handleBookingResponse(request.id, status, response);
    setIsLoading(false);
    if (!hadError) {
      setResponse('');
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        request.status === OpenHouseVisitRequestStatus.PENDING && setSelected(request.id)
      }
      activeOpacity={selected || request.status !== OpenHouseVisitRequestStatus.PENDING ? 1 : 0.8}>
      <View
        key={request.id}
        style={[
          styles.requestCard,
          request.status === OpenHouseVisitRequestStatus.PENDING && styles.pendingRequestCard,
          selected && styles.selectedRequestCard,
        ]}>
        <View style={styles.requestHeader}>
          <View>
            <Text style={styles.requestAddress}>{request.address}</Text>
            <Text style={styles.requestMeta}>Requested by: {request.requesterName}</Text>
            <Text style={styles.requestMeta}>
              Date: {new Date(request.date).toLocaleDateString()} at {request.time}
            </Text>
          </View>

          <View>
            <Badge
              text={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              variant={
                request.status === OpenHouseVisitRequestStatus.APPROVED
                  ? 'success'
                  : request.status === OpenHouseVisitRequestStatus.REJECTED
                    ? 'danger'
                    : 'warning'
              }
            />
          </View>
        </View>
        {!!request.message && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              <Text style={styles.bold}>Their message:</Text> {request.message}
            </Text>
          </View>
        )}
        {!!request.response && (
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>
              <Text style={styles.bold}>Your response:</Text> {request.response}
            </Text>
          </View>
        )}
        {request.status === OpenHouseVisitRequestStatus.PENDING && selected && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Response Message</Text>
              <InputField
                style={[styles.input, styles.textArea]}
                placeholder="Add a response message..."
                value={response}
                onChangeText={setResponse}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSuccess, styles.buttonFlex]}
                onPress={() => handleStatusChange(OpenHouseVisitRequestStatus.APPROVED)}
                disabled={isLoading}>
                <CheckCircle color="#fff" size={16} />
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDanger, styles.buttonFlex]}
                onPress={() => handleStatusChange(OpenHouseVisitRequestStatus.REJECTED)}
                disabled={isLoading}>
                <XCircle color="#fff" size={16} />
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline, styles.buttonFlex, styles.mt16]}
              onPress={() => setSelected(null)}
              disabled={isLoading}>
              <Text style={styles.buttonOutlineText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
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
    backgroundColor: theme.colors.primary,
  },
  buttonSuccess: {
    backgroundColor: theme.colors.success,
  },
  buttonDanger: {
    backgroundColor: theme.colors.danger,
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
  selectedRequestCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  pendingRequestCard: {
    borderColor: theme.colors.info,
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
