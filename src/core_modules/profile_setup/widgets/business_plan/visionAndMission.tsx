import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { FooterConfig, FormWrapper, HeaderConfig } from '../../../on_boarding/widgets/formsWrapper';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import { OnboardingFormData } from '../../../on_boarding/interface';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Text from '~/codidge_components/UI/text';

// Validation rules
const validationRules = {
  vision: {
    fiveYear: {
      required: 'Please share your 5-year vision',
    },
    oneYear: {
      required: 'Please share your 1-year mission',
    },
    statement: {
      required: 'Please share your mission statement',
    },
    drivesYou: {
      required: 'Tell us what drives you',
    },
  },
};

export const VisionAndMission = ({
  header,
  footer,
  props,
  currentStep,
  totalSteps,
}: {
  header: HeaderConfig;
  footer: FooterConfig;
  props: any;
  currentStep: number;
  totalSteps: number;
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  return (
    <FormWrapper
      header={header}
      footer={footer}
      props={props}
      currentStep={currentStep}
      totalSteps={totalSteps}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContent}>
          <Text style={styles.sectionTitle}>Vision and Mission</Text>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === 'ios' ? 0 : 80}
            keyboardShouldPersistTaps="handled">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 5-Year Vision */}
              <View style={styles.inputContainer}>
                <Controller
                  name="visionMission.fiveYear"
                  control={control}
                  rules={validationRules.vision.fiveYear}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="5-Year Vision"
                      required
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Where do you see yourself in 5 years?"
                      errorMessage={errors.visionMission?.fiveYear?.message}
                      error={!!errors.visionMission?.fiveYear}
                      numberOfLines={3}
                      multiline
                      style={styles.textArea}
                    />
                  )}
                />
              </View>

              {/* 1-Year Mission */}
              <View style={styles.inputContainer}>
                <Controller
                  name="visionMission.oneYear"
                  control={control}
                  rules={validationRules.vision.oneYear}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="1-Year Mission"
                      required
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="What will you achieve this year?"
                      errorMessage={errors.visionMission?.oneYear?.message}
                      error={!!errors.visionMission?.oneYear}
                      numberOfLines={3}
                      multiline
                      style={styles.textArea}
                    />
                  )}
                />
              </View>

              {/* Mission Statement */}
              <View style={styles.inputContainer}>
                <Controller
                  name="visionMission.statement"
                  control={control}
                  rules={validationRules.vision.statement}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="Mission Statement"
                      required
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="What will you achieve this year?"
                      errorMessage={errors.visionMission?.statement?.message}
                      error={!!errors.visionMission?.statement}
                      numberOfLines={3}
                      multiline
                      style={styles.textArea}
                    />
                  )}
                />
              </View>

              {/* What Drives You */}
              <View style={styles.inputContainer}>
                <Controller
                  name="visionMission.drivesYou"
                  control={control}
                  rules={validationRules.vision.drivesYou}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <InputField
                      label="What Drives You?"
                      required
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="What will you achieve this year?"
                      errorMessage={errors.visionMission?.drivesYou?.message}
                      error={!!errors.visionMission?.drivesYou}
                      numberOfLines={3}
                      multiline
                      style={styles.textArea}
                    />
                  )}
                />
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
    </FormWrapper>
  );
};

const styles = StyleSheet.create({
  formContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 12,
  },
  textArea: {
    minHeight: 70,
  },
});
