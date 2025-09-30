// SWOT Analysis Components - Individual Steps
import React from 'react';
import {
  Star,
  Award,
  Lightbulb,
  Clock,
  Book,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  Home,
  Zap,
  Smartphone,
  Target,
  TrendingUp,
  MapPin,
} from 'lucide-react-native';
import { FormWrapper } from '../formsWrapper';
import { SelectableItemsList } from '../selectableList';
import { useSystemSettings } from '~/system_setting/customHook';

/* // Strengths items data
const strengthsItems = [
  { id: 'communication', label: 'Excellent Communication Skills', icon: Users },
  { id: 'networking', label: 'Strong Network', icon: Users },
  { id: 'negotiation', label: 'Negotiation Skills', icon: Target },
  { id: 'market_knowledge', label: 'Market Knowledge', icon: TrendingUp },
  { id: 'customer_service', label: 'Customer Service', icon: Star },
  { id: 'technology', label: 'Tech Savvy', icon: Lightbulb },
  { id: 'experience', label: 'Years of Experience', icon: Award },
  { id: 'local_expertise', label: 'Local Market Expertise', icon: Target },
];

// Weaknesses items data
const weaknessesItems = [
  { id: 'time_management', label: 'Time Management', icon: Clock },
  { id: 'follow_up', label: 'Follow-up Process', icon: AlertTriangle },
  { id: 'lead_generation', label: 'Lead Generation', icon: Users },
  { id: 'pricing_strategy', label: 'Pricing Strategy', icon: DollarSign },
  { id: 'social_media', label: 'Social Media Marketing', icon: Smartphone },
  { id: 'market_analysis', label: 'Market Analysis', icon: Book },
  { id: 'presentation', label: 'Presentation Skills', icon: Users },
  { id: 'closing_deals', label: 'Closing Techniques', icon: AlertTriangle },
];

// Opportunities items data
const opportunitiesItems = [
  { id: 'market_growth', label: 'Growing Market Demand', icon: TrendingUp },
  { id: 'first_time_buyers', label: 'First-Time Homebuyers', icon: Home },
  { id: 'luxury_market', label: 'Luxury Market Segment', icon: Target },
  { id: 'investment_properties', label: 'Investment Properties', icon: DollarSign },
  { id: 'relocation_services', label: 'Corporate Relocations', icon: MapPin },
  { id: 'digital_marketing', label: 'Digital Marketing Growth', icon: Smartphone },
  { id: 'referral_network', label: 'Referral Partnerships', icon: Users },
  { id: 'new_developments', label: 'New Developments', icon: Home },
];

// Threats items data
const threatsItems = [
  { id: 'market_downturn', label: 'Market Downturn', icon: TrendingDown },
  { id: 'interest_rates', label: 'Rising Interest Rates', icon: DollarSign },
  { id: 'competition', label: 'Increased Competition', icon: Users },
  { id: 'economic_uncertainty', label: 'Economic Uncertainty', icon: AlertTriangle },
  { id: 'inventory_shortage', label: 'Low Inventory', icon: Home },
  { id: 'regulation_changes', label: 'Regulatory Changes', icon: Zap },
  { id: 'technology_disruption', label: 'Technology Disruption', icon: Smartphone },
  { id: 'seasonal_slowdown', label: 'Seasonal Market Slowdown', icon: TrendingDown },
]; */

// SWOT Strengths Component
export const SwotStrengths = ({ header, footer, props, currentStep, totalSteps }: any) => {
  const { onBoardingSchema } = useSystemSettings();

  const strengthsItems = onBoardingSchema.swottAnalysis.strengthsItems;

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

  const weaknessesItems = onBoardingSchema.swottAnalysis.weaknessesItems;

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

  const opportunitiesItems = onBoardingSchema.swottAnalysis.opportunitiesItems;

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

  const threatsItems = onBoardingSchema.swottAnalysis.threatsItems;

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
