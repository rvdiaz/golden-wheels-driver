import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { Header } from '~/codidge_components/UI/header';
import { ScrollableTabHeader, TabHeader } from '~/codidge_components/UI/tabs';
import { TransUnionPropertyList } from './widgets/propertyList';
import { ScreenRequestList } from './widgets/screenRequestList';
import { ScreenRentersList } from './widgets/rentersList';

enum RentalAppScreen {
  TransUnionPropertyList = 'TransUnionPropertyList',
  TransUnionScreenRequestList = 'TransUnionScreenRequestList',
  TransUnionRentersList = 'TransUnionRentersList',
}

export const TransunionRentsApplications = () => {
  const navigation = useNavigation();

  const [screen, setScreen] = useState<RentalAppScreen>(RentalAppScreen.TransUnionPropertyList);

  let body = <TransUnionPropertyList />;

  if (screen === RentalAppScreen.TransUnionScreenRequestList) {
    body = <ScreenRequestList />;
  }

  if (screen === RentalAppScreen.TransUnionRentersList) {
    body = <ScreenRentersList />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Rental Applications"
        showBack={true}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <Card style={styles.card}>
        <View style={styles.tabsContainer}>
          <TabHeader
            tabs={[
              {
                label: 'Properties',
                key: RentalAppScreen.TransUnionPropertyList,
              },
              {
                label: 'Screen Requests',
                key: RentalAppScreen.TransUnionScreenRequestList,
              },
            ]}
            onTabChange={(tabKey) => {
              setScreen(tabKey as RentalAppScreen);
            }}
          />
          <View style={styles.bodyContainer}>{body}</View>
        </View>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  card: {
    margin: 16,
    flex: 1,
    padding: 8,
  },
  tabsContainer: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
  },
});
