import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { theme } from '~/theme/theme';

interface ProfileCompletionWidgetProps {
  completedSteps: number;
  totalSteps: number;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  nextStepName?: string;
  size?: number;
  strokeWidth?: number;
}

export const ProfileCompletionWidget: React.FC<ProfileCompletionWidgetProps> = ({
  completedSteps = 3,
  totalSteps = 4,
  title = 'Set-Up',
  description = 'Complete your profile to unlock all features and improve your experience',
  onButtonPress,
  size = 110,
  strokeWidth = 18,
}) => {
  // Calculate progress percentage
  const progress = completedSteps / totalSteps;
  const percentage = Math.round(progress * 100);

  // SVG circle calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - progress * circumference;

  // Determine if profile is complete
  const isComplete = completedSteps === totalSteps;

  // Dynamic description based on completion
  const dynamicDescription = isComplete
    ? 'Your profile is complete! You can now access all features.'
    : description;

  return (
    <View style={styles.container}>
      {/* Left Side - Text Content */}
      <View style={styles.leftContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {dynamicDescription}
        </Text>

        <PrimaryButton
          style={{
            width: 120,
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 10,
          }}
          onPress={onButtonPress}
          size={ButtonSize.MEDIUM}
          title="See Full Plan"
        />
        {/* Action Button */}
      </View>

      {/* Right Side - Progress Ring */}
      <View style={styles.rightContent}>
        <View style={[styles.progressContainer, { width: size, height: size }]}>
          {/* SVG Progress Ring */}
          <Svg width={size} height={size} style={styles.svg}>
            <Defs>
              {/* Gradient for completed portion */}
              <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#6366F1" />
                <Stop offset="100%" stopColor="#3730A3" />
              </LinearGradient>
            </Defs>

            {/* Background circle (uncompleted) */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#C7D2FE"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress circle (completed) */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>

          {/* Center Content */}
          <View style={styles.centerContent}>
            <View style={styles.progressNumbers}>
              <Text style={[styles.completedNumber]}>{completedSteps}</Text>
              <Text style={styles.totalNumber}>/{totalSteps}</Text>
            </View>
            <Text style={styles.statusText}>{isComplete ? 'Complete' : 'Progress'}</Text>
          </View>
        </View>

        {/* Percentage indicator */}
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>
    </View>
  );
};

// Enhanced version with step details
interface Step {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

interface EnhancedProfileWidgetProps {
  steps: Step[];
  title?: string;
  onButtonPress?: (nextStep: Step) => void;
  onViewDetails?: () => void;
  size?: number;
  strokeWidth?: number;
}

export const EnhancedProfileCompletionWidget: React.FC<EnhancedProfileWidgetProps> = ({
  steps = [
    { id: '1', name: 'Personal Info', description: 'Add your basic information', completed: true },
    { id: '2', name: 'Profile Photo', description: 'Upload your profile picture', completed: true },
    { id: '3', name: 'Contact Details', description: 'Add email and phone', completed: true },
    { id: '4', name: 'Preferences', description: 'Set your app preferences', completed: false },
  ],
  title = 'Set-Up',
  onButtonPress,
  onViewDetails,
  size = 80,
  strokeWidth = 8,
}) => {
  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const nextStep = steps.find((step) => !step.completed);
  const isComplete = completedSteps === totalSteps;

  const progress = completedSteps / totalSteps;
  const percentage = Math.round(progress * 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - progress * circumference;

  const handleButtonPress = () => {
    if (nextStep && onButtonPress) {
      onButtonPress(nextStep);
    } else if (isComplete && onViewDetails) {
      onViewDetails();
    }
  };

  return (
    <View style={styles.enhancedContainer}>
      {/* Left Side */}
      <View style={styles.leftContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {!isComplete && (
            <View style={styles.remainingBadge}>
              <Text style={styles.remainingText}>{totalSteps - completedSteps} left</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {isComplete
            ? 'Great! Your profile is now complete and verified.'
            : `Complete ${nextStep?.name} to continue your profile setup.`}
        </Text>

        {/* Next Step Preview */}
        {!isComplete && nextStep && (
          <View style={styles.nextStepPreview}>
            <Text style={styles.nextStepLabel}>Next:</Text>
            <Text style={styles.nextStepName} numberOfLines={1}>
              {nextStep.name}
            </Text>
          </View>
        )}
        <PrimaryButton
          style={{
            width: 30,
          }}
          onPress={handleButtonPress}
          size={ButtonSize.MEDIUM}
          title={isComplete ? 'View Profile' : `Complete ${nextStep?.name}`}
        />
      </View>

      {/* Right Side - Progress Ring */}
      <View style={styles.rightContent}>
        <View style={[styles.progressContainer, { width: size, height: size }]}>
          <Svg width={size} height={size} style={styles.svg}>
            <Defs>
              <LinearGradient id="enhancedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#6366F1" />
                <Stop offset="100%" stopColor="#3730A3" />
              </LinearGradient>
            </Defs>

            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#C7D2FE"
              strokeWidth={strokeWidth}
              fill="none"
            />

            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#enhancedGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>

          <View style={styles.centerContent}>
            <View style={styles.progressNumbers}>
              <Text style={[styles.completedNumber]}>{completedSteps}</Text>
              <Text style={styles.totalNumber}>/{totalSteps}</Text>
            </View>
            <Text style={[styles.statusText, isComplete && styles.completeStatusText]}>
              {isComplete ? 'Complete' : 'Steps'}
            </Text>
          </View>
        </View>

        <Text style={[styles.percentageText, isComplete && styles.completePercentageText]}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2FF',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  enhancedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
  leftContent: {
    flex: 1,
    paddingRight: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3730A3',
    marginBottom: 8,
  },
  remainingBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  remainingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3730A3',
  },
  description: {
    fontSize: 14,
    color: '#4338CA',
    lineHeight: 18,
    marginBottom: 12,
  },
  nextStepPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
  },
  nextStepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 6,
  },
  nextStepName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  rightContent: {
    alignItems: 'center',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#818CF8',
    marginTop: 2,
  },
  completeStatusText: {
    color: '#10B981',
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
  },
  completePercentageText: {
    color: '#10B981',
  },
  progressNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },
  completedNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalNumber: {
    fontSize: 12,
    color: '#818CF8',
    fontWeight: '500',
  },
});
