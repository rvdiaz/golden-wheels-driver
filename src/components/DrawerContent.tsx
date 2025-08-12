import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import * as Icons from 'lucide-react-native';
import { ITenantModule } from '~/store/interface';

interface DrawerContentProps {
  navigation: any;
  modules: ITenantModule[];
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ navigation, modules }) => {
  const renderDrawerItem = (module: ITenantModule) => {
    const IconComponent = (Icons as any)[module.icon ?? ''] || Icons.Home;

    return (
      <TouchableOpacity
        key={module.moduleKey}
        style={styles.drawerItem}
        onPress={() => navigation.navigate(module.label)}>
        <IconComponent size={24} color="#374151" strokeWidth={2} />
        <Text style={styles.drawerItemText}>{module.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Real Estate Pro</Text>
          <Text style={styles.headerSubtitle}>Agent Dashboard</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tools & Settings</Text>
          {modules.map(renderDrawerItem)}
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 20,
    marginBottom: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
});
