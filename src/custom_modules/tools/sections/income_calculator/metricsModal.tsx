import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Icons from 'lucide-react-native';

const { height } = Dimensions.get('window');

interface MetricsModalProps {
  visible: boolean;
  onClose: () => void;
}

const MetricsModal: React.FC<MetricsModalProps> = ({ visible, onClose }) => {
  const metrics = {
    exp_convos_per100: 15,
    exp_fa_per100: 3,
    exp_close_per100: 1,
    fsbo_convos_per100: 25,
    fsbo_followups_per100: 8,
    fsbo_close_per100: 2,
    visit_contact_per: 1,
    visit_close_per10: 2,
    crm_close_per100: 1,
    cards_close_per250: 1,
    events_contacts_per10: 20,
    oh_contacts_per: 2,
    oh_closings_per10: 1,
    rental_calls_per2: 10,
    rental_clients_per2: 6,
    rental_close_per2: 1,
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Conversion Metrics Guide</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icons.X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            <Text style={styles.subtitle}>
              Industry benchmark conversion rates used in calculations
            </Text>

            <View style={styles.metricSection}>
              <Text style={styles.sectionTitle}>📞 Expired Calls (per 100 calls)</Text>
              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Conversations</Text>
                  <Text style={styles.metricValue}>{metrics.exp_convos_per100}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Follow-ups</Text>
                  <Text style={styles.metricValue}>{metrics.exp_fa_per100}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Closings</Text>
                  <Text style={styles.metricValue}>{metrics.exp_close_per100}</Text>
                </View>
                <View style={[styles.metricItem, styles.highlight]}>
                  <Text style={styles.metricLabel}>Close Rate</Text>
                  <Text style={styles.metricValueBold}>{metrics.exp_close_per100}%</Text>
                </View>
              </View>
              <Text style={styles.tip}>
                💡 Tip: Follow-up is key! Not all expireds are ready immediately.
              </Text>
            </View>

            <View style={styles.metricSection}>
              <Text style={styles.sectionTitle}>🏠 FSBO Calls (per 100 calls)</Text>
              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Conversations</Text>
                  <Text style={styles.metricValue}>{metrics.fsbo_convos_per100}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Follow-ups</Text>
                  <Text style={styles.metricValue}>{metrics.fsbo_followups_per100}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Closings</Text>
                  <Text style={styles.metricValue}>{metrics.fsbo_close_per100}</Text>
                </View>
                <View style={[styles.metricItem, styles.highlight]}>
                  <Text style={styles.metricLabel}>Close Rate</Text>
                  <Text style={styles.metricValueBold}>{metrics.fsbo_close_per100}%</Text>
                </View>
              </View>
              <Text style={styles.tip}>
                💡 Tip: FSBOs take time. Build trust with helpful information.
              </Text>
            </View>

            <View style={styles.metricSection}>
              <Text style={styles.sectionTitle}>🏘️ Rental Signs (per 2 signs)</Text>
              <View style={styles.metricGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Phone Calls</Text>
                  <Text style={styles.metricValue}>{metrics.rental_calls_per2}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Renters Worked</Text>
                  <Text style={styles.metricValue}>{metrics.rental_clients_per2}</Text>
                </View>
                <View style={[styles.metricItem, styles.highlight]}>
                  <Text style={styles.metricLabel}>Closings</Text>
                  <Text style={styles.metricValueBold}>{metrics.rental_close_per2}</Text>
                </View>
              </View>
              <Text style={styles.tip}>
                💡 Tip: Rentals = quick income + future buyer relationships!
              </Text>
            </View>

            <View style={styles.metricSection}>
              <Text style={styles.sectionTitle}>📊 Other Activities</Text>
              <View style={styles.metricList}>
                <View style={styles.listItem}>
                  <Text style={styles.listLabel}>FSBO Visits</Text>
                  <Text style={styles.listValue}>
                    {metrics.visit_contact_per} contact/visit, {metrics.visit_close_per10}{' '}
                    closings/10 visits
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listLabel}>Open Houses</Text>
                  <Text style={styles.listValue}>
                    {metrics.oh_contacts_per} contacts/house, {metrics.oh_closings_per10}{' '}
                    closings/10 houses
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listLabel}>Networking Events</Text>
                  <Text style={styles.listValue}>
                    {metrics.events_contacts_per10} contacts/10 events
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listLabel}>CRM Contacts</Text>
                  <Text style={styles.listValue}>
                    {metrics.crm_close_per100} closings/100 contacts
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.listLabel}>Business Cards</Text>
                  <Text style={styles.listValue}>
                    {metrics.cards_close_per250} closings/250 cards
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                These metrics are industry benchmarks. Your actual results may vary based on market
                conditions, experience, and execution quality.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  metricSection: {
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  metricGrid: {
    marginHorizontal: -6,
  },
  metricItem: {
    paddingHorizontal: 6,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  metricValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  highlight: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 0,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    width: '100%',
  },
  tip: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  metricList: {
    marginTop: 8,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  listValue: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#1E40AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default MetricsModal;
