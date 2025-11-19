import { useNavigation } from '@react-navigation/native';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { theme } from '~/theme/theme';
import * as Icons from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { useState } from 'react';
import { PageTransition } from '~/codidge_components/UI/pageTransition';
import { TransUnionPropertyList } from './widgets/property/propertyList';
import { ScreenRequestList } from './widgets/screen_request/screenRequestList';

export const TransunionRentsApplications = () => {
  const navigation = useNavigation();
  const [seeProperties, setSeeProperties] = useState(false);
  const [seeScreens, setSeeScreens] = useState(false);

  return (
    <PageSafeContainer style={styles.container}>
      <Header
        title="Rental Applications"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.toolContent}>
        <TouchableOpacity
          key={'properties'}
          style={styles.toolCard}
          onPress={() => {
            setSeeProperties(true);
          }}>
          <View style={styles.toolTextWrapper}>
            <View style={styles.toolIcon}>
              <Icons.HousePlus size={22} color={theme.colors.menuItemActive} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.toolTitle}>Properties</Text>
              <Text style={styles.toolDescription}>Build your professional identity</Text>
            </View>
          </View>
          <Icons.ChevronRight size={24} color={theme.colors.menuItemActive} />
        </TouchableOpacity>
        <TouchableOpacity
          key={'screens'}
          style={styles.toolCard}
          onPress={() => {
            setSeeScreens(true);
          }}>
          <View style={styles.toolTextWrapper}>
            <View style={styles.toolIcon}>
              <Icons.FileUser size={22} color={theme.colors.menuItemActive} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.toolTitle}>Applications</Text>
              <Text style={styles.toolDescription}>Build your professional identity</Text>
            </View>
          </View>
          <Icons.ChevronRight size={24} color={theme.colors.menuItemActive} />
        </TouchableOpacity>
      </View>
      <PageTransition isVisible={seeProperties} duration={350}>
        <TransUnionPropertyList
          onBack={() => {
            setSeeProperties(false);
          }}
        />
      </PageTransition>
      <PageTransition isVisible={seeScreens} duration={350}>
        <ScreenRequestList
          onBack={() => {
            setSeeScreens(false);
          }}
        />
      </PageTransition>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSectionsBackgroundColor,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    flex: 1,
    paddingTop: 16,
  },
  tabsContainer: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 6,
  },
  toolCard: {
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  toolContent: {
    padding: 16,
    gap: 16,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1B4B',
  },
  toolDescription: {
    fontSize: 14,
    color: '#737373',
  },
  toolCardDisabled: {
    opacity: 0.6,
  },
});
