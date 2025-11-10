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
import { getRentApplications } from '~/custom_modules/tools/api/queries';
import { theme } from '~/theme/theme';
import { isValidEmail } from '~/custom_modules/crm/helpers';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const ScreenRequestForm = ({
  disposeModalHandler,
  onAddScreenView,
}: {
  disposeModalHandler: () => void;
  onAddScreenView?: () => void;
}) => {
  const [emails, setEmails] = useState<string[]>(['']); // Start with
  const user = useReactiveVar(userData);
  const [property, setProperty] = useState<ITransUnionProperty>();

  const [initiateRentAppMutationFn, { loading }] = useMutation(initiateRentApplicationMutation, {
    refetchQueries: [
      {
        query: getRentApplications,
        variables: { userId: user?.id },
      },
    ],
  });

  // Validation function
  const isFormValid = () => {
    const invalidEmails = emails.find((em) => !isValidEmail(em));

    if (!property || !emails || invalidEmails || invalidEmails === '' || emails[0] === '')
      return false;
    return true;
  };

  const onSave = async () => {
    const isValid = isFormValid();
    if (!isValid) return;

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
      if (onAddScreenView) {
        onAddScreenView();
      } else {
        disposeModalHandler();
      }

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

      {/* Property Selection */}
      <PropertySelectorWidget
        onPropertySelect={(propData) => {
          setProperty(propData);
        }}
        selectedProperty={property}
        label="Property *"
        placeholder="Select a property for screening"
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.bodyContainer}>
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
    backgroundColor: theme.colors.surfaceSectionsBackgroundColor,
  },
  scrollContainer: {
    flex: 1,
  },
  bodyContainer: {
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
});
