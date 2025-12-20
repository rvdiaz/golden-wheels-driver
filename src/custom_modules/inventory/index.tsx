import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Text from '~/codidge_components/UI/text';
import { ITenantModule } from '~/store/user/interfaces';

type InventoryCard = {
  moduleKey: string;
  label: string;
  icon: string;
  color: string;
};

export const InventoryPage = () => {
  const navigation = useNavigation();
  const route: any = useRoute();

  const moduleData = route.params?.moduleData as ITenantModule | undefined;

  // Transform nested modules into cards
  const inventoryOptions: InventoryCard[] = React.useMemo(() => {
    if (!moduleData?.modules || moduleData.modules.length === 0) {
      return [];
    }

    return moduleData.modules.map((mod) => {
      const color = mod.color ?? '#6B7280';
      const icon = mod.icon ?? '📦';

      return {
        moduleKey: mod.moduleKey,
        label: mod.label ?? mod.moduleKey,
        icon,
        color,
      };
    });
  }, [moduleData]);

  const handleCardPress = (moduleKey: string) => {
    // Navigate to the specific inventory section
    navigation.navigate(moduleKey as never);
  };

  if (!moduleData || inventoryOptions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No inventory modules available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{moduleData.label ?? 'Inventory Management'}</Text>
        <Text style={styles.subtitle}>Choose what you want to manage</Text>
      </View>

      <View style={styles.cardsContainer}>
        {inventoryOptions.map((option) => (
          <TouchableOpacity
            key={option.moduleKey}
            style={styles.card}
            onPress={() => handleCardPress(option.moduleKey)}
            activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
              <Text style={styles.icon}>{option.icon}</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{option.label}</Text>
            </View>

            <View style={styles.arrow}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  cardsContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 32,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
