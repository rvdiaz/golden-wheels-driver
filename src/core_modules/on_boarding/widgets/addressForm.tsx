import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Flag } from 'lucide-react-native';
import InputField from '~/codidge_components/UI/form/inputs/inputField';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  mlsNumber: string;
  brokerage: string;
  email: string;
  phone: string;
  addressLine1: string;
  region: string;
  country: string;
  postalCode: string;
}

interface AddressFormProps {
  personalInfo: PersonalInfo;
  setPersonalInfo: (info: PersonalInfo) => void;
}

const US_STATES = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
  { label: 'District of Columbia', value: 'DC' },
];

const AddressForm: React.FC<AddressFormProps> = ({ personalInfo, setPersonalInfo }) => {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo({
      ...personalInfo,
      [field]: value,
    });
  };

  return (
    <View style={styles.container}>
      {/* USA Only Notice */}
      <View style={styles.usaNotice}>
        <Flag size={16} color="#1F2937" />
        <Text style={styles.usaNoticeText}>This service is available for US residents only</Text>
      </View>

      {/* Address Line 1 */}
      <InputField
        label="Street Address"
        placeholder="123 Main Street"
        value={personalInfo.addressLine1}
        onChangeText={(value) => updateField('addressLine1', value)}
        leftIcon={<MapPin size={20} color="#9CA3AF" />}
        required
      />

      {/* State/Region - Input field that looks like a picker but allows typing */}
      <InputField
        label="State"
        placeholder="Select or type state"
        value={personalInfo.region}
        onChangeText={(value) => updateField('region', value.toUpperCase())}
        hint="Two-letter state code (e.g., FL, CA, NY)"
        maxLength={2}
        autoCapitalize="characters"
        required
      />

      <View
        style={{
          flexDirection: 'column',
        }}>
        {/* ZIP Code */}
        <InputField
          label="ZIP Code"
          placeholder="12345"
          value={personalInfo.postalCode}
          onChangeText={(value) => updateField('postalCode', value)}
          keyboardType="numeric"
          maxLength={10}
          required
        />

        {/* Country - Disabled field showing USA */}
        <InputField
          label="Country"
          value={personalInfo.country}
          onChangeText={(value) => updateField('country', value)}
          editable={false}
          style={styles.disabledInput}
          hint="Service available in USA only"
          leftIcon={<Flag size={20} color="#9CA3AF" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  usaNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  usaNoticeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
  },
});

export default AddressForm;
