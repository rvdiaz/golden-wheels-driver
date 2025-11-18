import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { useActiveUserGoals } from './hooks/useActiveUserGoals';
import { GoalList } from './components/GoalList';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { subscriptionStatusData } from '~/store/subscription';
import { useReactiveVar } from '@apollo/client';
import { SubscriptionCardButton } from '~/custom_modules/iap/components/subscriptionCard';

export const GoalsScreen = () => {
  const navigation = useNavigation();
  const { hasActiveSubscription } = useReactiveVar(subscriptionStatusData);

  const { goals, isLoading } = useActiveUserGoals();


  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Goals" showBack onBack={() => navigation.goBack()} />
{ hasActiveSubscription ? <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          <GoalList goals={goals || []} displayList={goals || []} isLoading={isLoading} />
        </View>
      </ScrollView>:<SubscriptionCardButton/>}
      
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
  },
});
