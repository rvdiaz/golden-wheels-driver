import { useMutation, useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import Constants from 'expo-constants';
import { initiateRentApplicationMutation } from '~/custom_modules/tools/api/mutations';
import { userData } from '~/store/user';
import { MultipleContactEmails } from '~/custom_modules/crm/widgets/crmContactSelector';
import { PropertySelectorWidget } from '../property/propertySelector';
import { ITransUnionProperty } from '../../interfaces';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { Send } from 'lucide-react-native';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ScreenRequestForm = ({
  disposeModalHandler,
  onAddScreenView,
}: {
  disposeModalHandler: () => void;
  onAddScreenView: () => void;
}) => {
  const [emails, setEmails] = useState<string[]>(['']); // Start with
  const user = useReactiveVar(userData);
  const [property, setProperty] = useState<ITransUnionProperty>();

  const [initiateRentAppMutationFn, { loading }] = useMutation(initiateRentApplicationMutation);

  // Validation function
  const isFormValid = () => {
    if (!property || !emails || emails?.length === 0) return false;
    return true;
  };

  const onSave = async () => {
    if (!isFormValid()) return;

    try {
      await initiateRentAppMutationFn({
        variables: {
          tenant: {
            tenantId,
          },
          property: property,
          userId: user?.id,
          propertyId: property?.propertyId,
          contactEmails: emails, // Add this to your mutation variables
        },
      });

      onAddScreenView();
      disposeModalHandler();

      // Reset form
      setProperty(undefined);
      setEmails([]);
    } catch (error) {
      console.log('::error', error);
      // You might want to show an error alert here
    }
  };

  return (
    <PageSafeContainer style={styles.container}>
      <Header title="Screening Request" showBack={true} onBack={disposeModalHandler} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.bodyContainer}>
          {/* Property Selection */}
          <PropertySelectorWidget
            onPropertySelect={(propData) => {
              setProperty(propData);
            }}
            selectedProperty={property}
            label="Property *"
            placeholder="Select a property for screening"
          />

          {/* Email Selection */}
          <MultipleContactEmails
            emails={emails ?? []}
            onEmailsChange={setEmails}
            label="Contact Emails *"
            minEmails={1}
            maxEmails={5} // Adjust as needed
          />
        </View>
      </ScrollView>
      <View
        style={{
          padding: 15,
        }}>
        <PrimaryButton
          title="Send Application"
          disabled={!isFormValid()}
          size={ButtonSize.LARGE}
          onPress={onSave}
          loading={loading}
          rightWidget={
            <Send
              style={{
                marginLeft: 5,
              }}
              size={20}
              color={'#fff'}
            />
          }
        />
      </View>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  bodyContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
