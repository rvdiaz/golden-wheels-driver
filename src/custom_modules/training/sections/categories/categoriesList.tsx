import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useNavigation } from '@react-navigation/native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';
import { useQuery } from '@apollo/client';
import { TenantData, TrainingCategory } from '../../interfaces';
import { GET_ALL_TRAINING_CATEGORIES } from '../../graphql/queries';
import Constants from 'expo-constants';
import { ModuleKeys } from '~/store/interface';

interface TrainingCategoriesScreenProps {
  tenant: TenantData;
}

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const TrainingCategoriesScreen: React.FC<TrainingCategoriesScreenProps> = () => {
  const navigation = useNavigation();
  const tenant = {
    tenantId: `TENANT#${tenantId}`,
  };

  const { data, loading, error } = useQuery(GET_ALL_TRAINING_CATEGORIES, {
    variables: {
      tenant,
    },
  });

  const categories: TrainingCategory[] = data?.getAllTrainingCategories || [];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icons.AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorText}>Error loading categories</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Icons.BookOpen size={48} color="#9CA3AF" />
        <Text style={styles.emptyText}>No training categories available</Text>
        <Text style={styles.emptySubtext}>Check back later for new content</Text>
      </View>
    );
  }

  const handleCategoryPress = (category: TrainingCategory) => {
    navigation.navigate(ModuleKeys.trainingPrograms, {
      category,
      tenant,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Training Categories</Text>
          <Text style={styles.headerSubtitle}>Select a category to explore training programs</Text>
        </View>

        {categories.map((category) => (
          <Card key={category.categoryId} style={styles.categoryCard}>
            <TouchableOpacity
              onPress={() => handleCategoryPress(category)}
              style={styles.categoryContent}
              activeOpacity={0.7}>
              <View style={styles.categoryIcon}>
                <Icons.FolderOpen size={32} color={theme.colors.primary} />
              </View>

              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription} numberOfLines={2}>
                  {category.description}
                </Text>
              </View>

              <Icons.ChevronRight size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.bodyBackground,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  categoryCard: {
    marginBottom: 16,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
