import { StyleSheet, View } from 'react-native';
import { MyBookings } from './components/MyBookings';
import { IncomingBookingList } from './components/IncomingBookingList';

export const ManageVisitRequestsTab = () => {
  return (
    <View>
      <IncomingBookingList />
      <MyBookings />
    </View>
  );
};

const styles = StyleSheet.create({
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonSuccess: {
    backgroundColor: '#16a34a',
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
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
