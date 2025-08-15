import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import * as Icons from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LogoutButton } from '~/codidge_components/auth/widgets/logoutButton';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" showBack onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Icons.User size={50} color="#6B7280" />
          </View>
          <Text style={styles.profileName}>Sarah Johnson</Text>
          <Text style={styles.profileRole}>Real Estate Agent</Text>
          <Text style={styles.profileCompany}>Premier Realty Group</Text>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Performance Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>47</Text>
              <Text style={styles.statLabel}>Active Leads</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Deals Closed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>$2.4M</Text>
              <Text style={styles.statLabel}>Total Sales</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Icons.User size={20} color="#374151" />
            <Text style={styles.menuText}>Personal Information</Text>
            <Icons.ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icons.Bell size={20} color="#374151" />
            <Text style={styles.menuText}>Notifications</Text>
            <Icons.ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icons.Lock size={20} color="#374151" />
            <Text style={styles.menuText}>Privacy & Security</Text>
            <Icons.ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icons.HelpCircle size={20} color="#374151" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Icons.ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </Card>

        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Icons.Settings size={20} color="#374151" />
            <Text style={styles.menuText}>App Settings</Text>
            <Icons.ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <LogoutButton />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#2563EB',
    marginBottom: 4,
  },
  profileCompany: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuCard: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
});
