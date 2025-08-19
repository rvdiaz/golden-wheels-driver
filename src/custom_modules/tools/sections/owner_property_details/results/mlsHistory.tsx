import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { IMlsHistoryItem } from '../interfaces';

export const MlsHistoryList = ({ mlsHistory }: { mlsHistory: IMlsHistoryItem[] }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.resultHeader}>
        <Icons.Home size={24} color="#2563EB" />
        <Text style={styles.resultTitle}>MLS History</Text>
      </View>
      {mlsHistory.map((item, index) => (
        <View key={`${item.seqNo}-${item.statusDate}`}>
          <MlsHistoryCard item={item} />
          {index < mlsHistory.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </Card>
  );
};

const MlsHistoryCard: React.FC<{ item: IMlsHistoryItem }> = ({ item }) => {
  const formattedDate = new Date(item.statusDate).toLocaleDateString();

  const statusColors: Record<string, string> = {
    Active: '#34D399',
    Pending: '#FBBF24',
    Closed: '#F87171',
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.header}>
        <Text style={[styles.status, { color: statusColors[item.status] || '#1F2937' }]}>
          {item.status}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>${item.price.toLocaleString()}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Beds/Baths:</Text>
        <Text style={styles.value}>
          {item.beds} / {item.baths}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Days on Market:</Text>
        <Text style={styles.value}>{item.daysOnMarket}</Text>
      </View>

      <View style={styles.agentSection}>
        <Icons.User size={16} color="#2563EB" />
        <Text style={styles.agentName}>{item.agentName}</Text>
      </View>
      <Text style={[styles.agentInfo, { marginTop: 2 }]}>{item.agentOffice}</Text>
      <Text style={[styles.agentInfo, { marginTop: 2 }]}>{item.agentEmail}</Text>
      <Text style={[styles.agentInfo, { marginTop: 2 }]}>{item.agentPhone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  itemContainer: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  status: {
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  agentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  agentName: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  agentInfo: {
    fontSize: 12,
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
});
