import { useMutation, useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { createScreeningMutation } from '~/custom_modules/tools/api/mutations';
import { userData } from '~/store/user';
import { MultipleContactEmails } from '~/custom_modules/crm/widgets/crmContactSelector';
import { PropertySelectorWidget } from '../property/propertySelector';
import { ITransUnionProperty } from '../../interfaces';

// Contact Interface (adjust according to your contact structure)
interface IContact {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
}

export const ScreenRequestForm = ({
  disposeModalHandler,
  onAddScreenView,
}: {
  disposeModalHandler: () => void;
  onAddScreenView: () => void;
}) => {
  const [emails, setEmails] = useState<string[]>(); // Start with
  const user = useReactiveVar(userData);
  const [property, setProperty] = useState<ITransUnionProperty>();

  const [createScreeningMutationFn, { loading }] = useMutation(createScreeningMutation);

  // Validation function
  const isFormValid = () => {
    if (!property || !emails || emails?.length === 0) return false;
    return true;
  };

  const onSave = async () => {
    if (!isFormValid()) return;

    try {
      await createScreeningMutationFn({
        variables: {
          userId: user?.id,
          propertyId: property?.propertyId,
          contactEmails: emails, // Add this to your mutation variables
          // or contacts: contacts.filter(c => c && c.id), if you want to send full contact objects
        },
      });

      onAddScreenView();
      disposeModalHandler();

      // Reset form
      setProperty(undefined);
      setEmails(undefined);
    } catch (error) {
      console.log('::error', error);
      // You might want to show an error alert here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Add Screening Request"
        showBack={true}
        onBack={disposeModalHandler}
        rightAction={onSave}
        rightText="Save"
        loadingRight={loading}
        disabledRight={!isFormValid()}
      />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  bodyContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
