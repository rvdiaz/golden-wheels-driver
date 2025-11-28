import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Text from '~/codidge_components/UI/text';
import { useNavigation } from '@react-navigation/native';
import { Card } from '~/codidge_components/UI/card';
import * as Icons from 'lucide-react-native';
import { theme } from '~/theme/theme';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_ALL_TRAINING_MODULES } from '../../graphql/queries';
import { TrainingModule } from '../../interfaces';
import { ModuleKeys } from '~/store/interface';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { Header } from '~/codidge_components/UI/header';
import Constants from 'expo-constants';
import { subscriptionStatusData } from '~/store/subscription';
import { SubscriptionCardButton } from '~/custom_modules/iap/components/subscriptionCard';
import PrimaryButton from '~/codidge_components/UI/button/PrimaryButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';

const tenantId = Constants.expoConfig?.extra?.TENANTID;
const trainingId = 'e8901fca-1b45-417b-8272-3a8efd5a8291';

export const TrainingModulesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { hasActiveSubscription } = useReactiveVar(subscriptionStatusData);

  const { data, loading, error, refetch } = useQuery(GET_ALL_TRAINING_MODULES, {
    variables: {
      tenant: {
        tenantId: `TENANT#${tenantId}`,
      },
      trainingProgramId: trainingId,
    },
  });

  const modules: TrainingModule[] = data?.getAllTrainingModules || [];
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  const handleModulePress = (module: TrainingModule) => {
    navigation.navigate(ModuleKeys.trainingCourses, {
      module,
      program: {
        trainingId,
      },
      tenant: {
        tenantId: `TENANT#${tenantId}`,
      },
    });
  };

  if (!hasActiveSubscription) {
    return <SubscriptionCardButton />;
  }

  if (loading) {
    return (
      <PageSafeContainer style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading modules...</Text>
        </View>
      </PageSafeContainer>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Icons.AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorText}>Error loading modules</Text>
          <PrimaryButton
            title="Retry"
            size={ButtonSize.LARGE}
            onPress={async () => {
              await refetch();
            }}
            loading={loading}
          />
        </View>
      </View>
    );
  }

  if (sortedModules.length === 0) {
    return (
      <PageSafeContainer style={styles.container}>
        <View style={styles.centerContainer}>
          <Icons.BookOpen size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No modules available</Text>
        </View>
      </PageSafeContainer>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={async () => {
              await refetch();
            }}
          />
        }
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Modules List */}
        <Text style={styles.sectionTitle}>Modules</Text>

        {sortedModules.map((module, index) => (
          <Card key={module.moduleId} style={styles.moduleCard}>
            <TouchableOpacity
              onPress={() => handleModulePress(module)}
              style={styles.moduleContent}
              activeOpacity={0.7}>
              <View style={styles.moduleNumber}>
                <Text style={styles.moduleNumberText}>{index + 1}</Text>
              </View>

              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDescription} numberOfLines={2}>
                  {module.description}
                </Text>

                <View style={styles.moduleFooter}>
                  {/* <View style={styles.durationContainer}>
                    <Icons.Clock size={14} color="#6B7280" />
                    <Text style={styles.durationText}>
                      {formatDuration(module.estimatedDuration)}
                    </Text>
                  </View> */}

                  {module.tags && module.tags.length > 0 && (
                    <View style={styles.moduleTagsContainer}>
                      {module.tags.slice(0, 2).map((tag, idx) => (
                        <View key={idx} style={styles.moduleTag}>
                          <Text style={styles.moduleTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <Icons.ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </Card>
        ))}

        {/* Progress Card */}
        {/*  <Card style={styles.progressCard}>
          <View style={styles.progressContent}>
            <Icons.Award size={32} color="#F59E0B" />
            <View style={styles.progressText}>
              <Text style={styles.progressTitle}>Track Your Progress</Text>
              <Text style={styles.progressDescription}>
                Complete all modules to earn your certificate
              </Text>
            </View>
          </View>
        </Card> */}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  headerCard: {
    marginBottom: 24,
  },
  headerContent: {
    padding: 20,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  moduleCard: {
    marginBottom: 12,
  },
  moduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  moduleNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  moduleInfo: {
    flex: 1,
    marginRight: 12,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  moduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  moduleTagsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  moduleTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  moduleTagText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '500',
  },
  progressCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginTop: 16,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  progressText: {
    flex: 1,
    marginLeft: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  progressDescription: {
    fontSize: 13,
    color: '#A16207',
    lineHeight: 18,
  },
});
