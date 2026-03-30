import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingSpinner } from './loadingSpinner';
import { Header } from '../header';
import { useNavigation } from '@react-navigation/native';
import { PageSafeContainer } from '../pageSafeContainer';
import { BodyWrapper } from '../bodyWrapper';
import { theme } from '~/theme/theme';

interface ILoadingPageProps {
  headerTitle?: string;
  style?: object; // optional extra style
}

export const PageLoading = ({ style, headerTitle }: ILoadingPageProps) => {
  const navigation = useNavigation();

  return (
    <BodyWrapper>
      <PageSafeContainer style={styles.container}>
        {headerTitle && (
          <Header showBack={true} title={headerTitle} onBack={() => navigation.goBack()} />
        )}
        <View style={styles.centerContent}>
          <LoadingSpinner color={theme.colors.primary} />
        </View>
      </PageSafeContainer>
    </BodyWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
