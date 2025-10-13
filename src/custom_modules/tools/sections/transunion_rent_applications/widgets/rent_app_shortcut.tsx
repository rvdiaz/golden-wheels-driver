import React, { useState } from 'react';
import { Modal, View, Animated } from 'react-native';
import { InfoWidget } from '~/custom_modules/dashboard/widgets/rentApplication';
import { ScreenRequestForm } from './screen_request/screenRequestForm';
import { useNavigation } from '@react-navigation/native';
import { ModuleKeys } from '~/store/interface';
import { theme } from '~/theme/theme';
import Text from '~/codidge_components/UI/text';

export const RentAppShortcut = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation();

  const showConfirmationToast = () => {
    setShowConfirmation(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmation(false);
    });
  };

  return (
    <View style={{ flex: 1, marginBottom: 16 }}>
      <InfoWidget
        title="Rent Application"
        description="Submit your rental application quickly and securely."
        imageSource={require('assets/rentApplication.png')}
        backgroundColor="#E1F1FF"
        buttonText="Screen Applicant"
        secondButtonText="See Results"
        backgroundButtonColor={theme.colors.primary}
        onSecondButtonPress={() => {
          navigation.navigate(ModuleKeys.transUnionRentApplications);
        }}
        onButtonPress={() => {
          setModalVisible(true);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ScreenRequestForm
            disposeModalHandler={() => {
              setModalVisible(false);
            }}
            onAddScreenView={() => {
              setModalVisible(false);
              showConfirmationToast();
            }}
          />
        </View>
      </Modal>

      {/* Confirmation Toast */}
      {showConfirmation && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            right: 20,
            backgroundColor: '#4CAF50',
            padding: 16,
            borderRadius: 8,
            opacity: fadeAnim,
            zIndex: 1000,
          }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            ✓ Application submitted successfully!
          </Text>
        </Animated.View>
      )}
    </View>
  );
};
