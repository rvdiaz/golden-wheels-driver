import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';
import { Header } from '~/codidge_components/UI/header';
import { TabHeader } from '~/codidge_components/UI/tabs';
import { TransUnionPropertyList } from './widgets/property/propertyList';
import { ScreenRequestList } from './widgets/screen_request/screenRequestList';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

enum RentalAppScreen {
  TransUnionPropertyList = 'TransUnionPropertyList',
  TransUnionScreenRequestList = 'TransUnionScreenRequestList',
  TransUnionRentersList = 'TransUnionRentersList',
}

export const TransunionRentsApplications = () => {
  const navigation = useNavigation();

  const [screen, setScreen] = useState<RentalAppScreen>(
    RentalAppScreen.TransUnionScreenRequestList
  );

  let body = <TransUnionPropertyList />;

  if (screen === RentalAppScreen.TransUnionScreenRequestList) {
    body = <ScreenRequestList />;
  }

  return (
    <PageSafeContainer style={styles.container}>
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
                label: 'Screening',
                key: RentalAppScreen.TransUnionScreenRequestList,
              },
              {
                label: 'Properties',
                key: RentalAppScreen.TransUnionPropertyList,
              },
            ]}
            onTabChange={(tabKey) => {
              setScreen(tabKey as RentalAppScreen);
            }}
          />
          <View style={styles.bodyContainer}>{body}</View>
        </View>
      </Card>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
});
