import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import OutlineButton from '~/codidge_components/UI/button/OutlineButton';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';

interface InfoWidgetProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  secondButtonText?: string;
  onSecondButtonPress?: () => void;
  imageSource?: ImageSourcePropType;
  imageSize?: number;
  backgroundColor?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export const InfoWidget: React.FC<InfoWidgetProps> = ({
  title = 'Rent Application',
  description = '',
  buttonText = 'Get Started',
  secondButtonText = '',
  onButtonPress,
  onSecondButtonPress,
  imageSource,
  imageSize = 80,
  backgroundColor = '#EEF2FF',
  titleColor = '#3730A3',
  descriptionColor = '#4338CA',
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Left Side - Text Content */}
      <View style={styles.leftContent}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        <Text style={[styles.description, { color: descriptionColor }]} numberOfLines={3}>
          {description}
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            style={{
              width: 120,
              paddingHorizontal: 10,
            }}
            onPress={onButtonPress}
            size={ButtonSize.MEDIUM}
            title={buttonText}
          />
          {secondButtonText && onSecondButtonPress && (
            <OutlineButton
              onPress={onSecondButtonPress}
              size={ButtonSize.MEDIUM}
              title={secondButtonText}
            />
          )}
        </View>
      </View>

      {/* Right Side - Image */}
      <View style={styles.rightContent}>
        <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={[styles.image, { width: imageSize, height: imageSize }]}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.placeholderImage, { width: imageSize, height: imageSize }]}>
              <Text style={styles.placeholderText}>📱</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// Enhanced version with more customization
export const EnhancedInfoWidget: React.FC<InfoWidgetProps> = ({
  title = 'Get Started',
  description = 'Great! Your profile is now complete and verified.',
  buttonText = 'Continue',
  onButtonPress,
  imageSource,
  imageSize = 80,
  backgroundColor = '#FFFFFF',
  titleColor = '#3730A3',
  descriptionColor = '#4338CA',
}) => {
  return (
    <View style={[styles.enhancedContainer, { backgroundColor }]}>
      {/* Left Side */}
      <View style={styles.leftContent}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        </View>

        <Text style={[styles.description, { color: descriptionColor }]} numberOfLines={2}>
          {description}
        </Text>

        <PrimaryButton
          style={{
            alignSelf: 'flex-start',
          }}
          onPress={onButtonPress}
          size={ButtonSize.MEDIUM}
          title={buttonText}
        />
      </View>

      {/* Right Side - Image */}
      <View style={styles.rightContent}>
        <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={[styles.image, { width: imageSize, height: imageSize }]}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.placeholderImage, { width: imageSize, height: imageSize }]}>
              <Text style={styles.placeholderText}>🎯</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  enhancedContainer: {
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
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  rightContent: {
    height: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 12,
  },
  placeholderImage: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 32,
    opacity: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

// Usage Examples:
/*
// Basic usage with image
<InfoWidget
  title="Welcome Back!"
  description="Continue where you left off and explore new features"
  buttonText="Continue"
  imageSource={require('./assets/welcome-image.png')}
  onButtonPress={() => console.log('Button pressed')}
/>

// Without image (shows placeholder)
<InfoWidget
  title="Get Started"
  description="Set up your profile to get the most out of our app"
  buttonText="Start Setup"
  onButtonPress={() => console.log('Setup started')}
/>

// Enhanced version
<EnhancedInfoWidget
  title="All Done!"
  description="Your setup is complete. Start exploring all the features now."
  buttonText="Explore"
  imageSource={require('./assets/success-image.png')}
  backgroundColor="#F0FDF4"
  titleColor="#059669"
  descriptionColor="#065F46"
  onButtonPress={() => console.log('Exploring...')}
/>

// Custom colors
<InfoWidget
  title="Special Offer"
  description="Upgrade to premium and get access to exclusive features"
  buttonText="Upgrade Now"
  backgroundColor="#FEF3C7"
  titleColor="#D97706"
  descriptionColor="#92400E"
  imageSource={require('./assets/premium-image.png')}
/>
*/
