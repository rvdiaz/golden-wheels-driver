import React from 'react';
import { Text } from 'react-native';
import { FormWrapper } from '../formsWrapper';

// Preferences Component Example
export const FinantialGoals = ({ header, footer, props, currentStep }: any) => {
  return (
    <FormWrapper header={header} footer={footer} props={props} currentStep={currentStep}>
      <Text>Finantial Goals</Text>
    </FormWrapper>
  );
};
