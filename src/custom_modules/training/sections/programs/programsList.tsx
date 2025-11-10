import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useNavigation } from '@react-navigation/native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';
import { useQuery } from '@apollo/client';
import { TrainingLevel, TrainingProgram } from '../../interfaces';
import { GET_ALL_TRAINING_PROGRAMS } from '../../graphql/queries';
import { ModuleKeys } from '~/store/interface';
import Constants from 'expo-constants';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';

const tenantId = Constants.expoConfig?.extra?.TENANTID;
const categoryId = Constants.expoConfig?.extra?.TRAINING_CATEGORY_ID;

export const TrainingProgramsScreen: React.FC = () => {
  const navigation = useNavigation();

  const { category, tenant } = {
    category: categoryId,
    tenant: {
      tenantId: `TENANT#${tenantId}`,
    },
  };

  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const { data, loading, error, refetch } = useQuery(GET_ALL_TRAINING_PROGRAMS, {
    variables: { tenant, categoryId },
  });

  let programs: TrainingProgram[] = data?.getAllTrainingPrograms || [];

  if (filterLevel !== 'ALL') {
    programs = programs.filter((p) => p.level === filterLevel);
  }

  const getLevelColor = (level: TrainingLevel) => {
    const colors = {
      BEGINNER: '#10B981',
      INTERMEDIATE: '#F59E0B',
      ADVANCED: '#F97316',
      EXPERT: '#EF4444',
    };
    return colors[level] || '#6B7280';
  };

  const handleProgramPress = (program: TrainingProgram) => {
    navigation.navigate(ModuleKeys.trainingModules, {
      program,
      category,
      tenant,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading programs...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Icons.AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorText}>Error loading programs</Text>
          <PrimaryButton
            title="Retry"
            size={ButtonSize.LARGE}
            onPress={async () => {
              await refetch();
            }}
          />
        </View>
      </View>
    );
  }

  if (programs.length === 0 && filterLevel === 'ALL') {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Icons.BookOpen size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No training programs available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Training Programs</Text>
          {category && <Text style={styles.headerSubtitle}>{category.name}</Text>}
        </View>

        {/* Level Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}>
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setFilterLevel(level)}
              style={[styles.filterChip, filterLevel === level && styles.filterChipActive]}>
              <Text style={[styles.filterText, filterLevel === level && styles.filterTextActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Programs List */}
        {programs.map((program) => (
          <Card key={program.trainingId} style={styles.programCard}>
            <TouchableOpacity
              onPress={() => handleProgramPress(program)}
              style={styles.programContent}
              activeOpacity={0.7}>
              <View style={styles.programHeader}>
                <View style={styles.programInfo}>
                  <Text style={styles.programTitle}>{program.title}</Text>
                  <View
                    style={[
                      styles.levelBadge,
                      { backgroundColor: getLevelColor(program.level) + '20' },
                    ]}>
                    <Text style={[styles.levelText, { color: getLevelColor(program.level) }]}>
                      {program.level}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.programDescription} numberOfLines={3}>
                {program.description}
              </Text>

              {program.tags && program.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {program.tags.slice(0, 3).map((tag, idx) => (
                    <View key={idx} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                  {program.tags.length > 3 && (
                    <Text style={styles.moreTagsText}>+{program.tags.length - 3}</Text>
                  )}
                </View>
              )}

              <View style={styles.programFooter}>
                <Text style={styles.createdText}>
                  Created {new Date(program.createdAt).toLocaleDateString()}
                </Text>
                <Icons.ChevronRight size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </Card>
        ))}

        {programs.length === 0 && filterLevel !== 'ALL' && (
          <View style={styles.emptyFilterContainer}>
            <Icons.Filter size={32} color="#9CA3AF" />
            <Text style={styles.emptyFilterText}>No programs found for {filterLevel} level</Text>
            <TouchableOpacity onPress={() => setFilterLevel('ALL')}>
              <Text style={styles.clearFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  filterContainer: {
    marginBottom: 16,
    maxHeight: 48,
  },
  filterContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  programCard: {
    marginBottom: 16,
  },
  programContent: {
    padding: 20,
  },
  programHeader: {
    marginBottom: 12,
  },
  programInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  programTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  programDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  programFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  createdText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyFilterContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyFilterText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 16,
  },
  clearFilterText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
