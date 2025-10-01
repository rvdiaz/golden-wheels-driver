import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { useNavigation } from '@react-navigation/native';
import { useActiveUserGoals } from './hooks/useActiveUserGoals';
import { GoalList } from './components/GoalList';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

export const GoalsScreen = () => {
  const navigation = useNavigation();

  const { goals, isLoading } = useActiveUserGoals();

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Goals" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          <GoalList goals={goals || []} displayList={goals || []} isLoading={isLoading} />
        </View>
      </ScrollView>
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
