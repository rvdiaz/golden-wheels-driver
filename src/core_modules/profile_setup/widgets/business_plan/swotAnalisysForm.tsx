// SWOT Analysis Components - Individual Steps
import React from 'react';

import { FormWrapper } from './formsWrapper';
import { SelectableItemsList } from './selectableList';
import { useSystemSettings } from '~/system_setting/customHook';

// SWOT Strengths Component
export const SwotStrengths = ({ header, footer, props, currentStep, totalSteps }: any) => {
  const { onBoardingSchema } = useSystemSettings();

  const strengthsItems = onBoardingSchema?.swottAnalysis?.strengthsItems ?? [];

  return (
    <FormWrapper
      header={header}
      footer={footer}
      props={props}
      currentStep={currentStep}
      totalSteps={totalSteps}>
      <SelectableItemsList
        items={strengthsItems}
        fieldName="swotAnalysis.strengths"
        title="Select Your Strengths"
      />
    </FormWrapper>
  );
};

// SWOT Weaknesses Component
export const SwotWeaknesses = ({ header, footer, props, currentStep, totalSteps }: any) => {
  const { onBoardingSchema } = useSystemSettings();

  const weaknessesItems = onBoardingSchema?.swottAnalysis?.weaknessesItems ?? [];

  return (
    <FormWrapper
      header={header}
      footer={footer}
      props={props}
      currentStep={currentStep}
      totalSteps={totalSteps}>
      <SelectableItemsList
        items={weaknessesItems}
        fieldName="swotAnalysis.weaknesses"
        title="Areas for Improvement"
      />
    </FormWrapper>
  );
};

// SWOT Opportunities Component
export const SwotOpportunities = ({ header, footer, props, currentStep, totalSteps }: any) => {
  const { onBoardingSchema } = useSystemSettings();

  const opportunitiesItems = onBoardingSchema?.swottAnalysis?.opportunitiesItems ?? [];

  return (
    <FormWrapper
      header={header}
      footer={footer}
      props={props}
      currentStep={currentStep}
      totalSteps={totalSteps}>
      <SelectableItemsList
        items={opportunitiesItems}
        fieldName="swotAnalysis.opportunities"
        title="Market Opportunities"
      />
    </FormWrapper>
  );
};

// SWOT Threats Component
export const SwotThreats = ({ header, footer, props, currentStep, totalSteps }: any) => {
  const { onBoardingSchema } = useSystemSettings();

  const threatsItems = onBoardingSchema?.swottAnalysis?.threatsItems ?? [];

  return (
    <FormWrapper
      header={header}
      footer={footer}
      props={props}
      currentStep={currentStep}
      totalSteps={totalSteps}>
      <SelectableItemsList
        items={threatsItems}
        fieldName="swotAnalysis.threats"
        title="Potential Challenges"
      />
    </FormWrapper>
  );
};
