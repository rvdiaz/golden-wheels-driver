import { AlertTriangle, X } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Text from '~/codidge_components/UI/text';

interface CancelModalProps {
  visible: boolean;
  step: 1 | 2;
  loading: boolean;
  onFirstConfirm: () => void;
  onFinalConfirm: () => void;
  onClose: () => void;
}

const RED = '#f87171';
const RED_12 = 'rgba(248,113,113,0.12)';
const RED_22 = 'rgba(248,113,113,0.22)';

export const CancelModal = ({
  visible,
  step,
  loading,
  onFirstConfirm,
  onFinalConfirm,
  onClose,
}: CancelModalProps) => {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 18,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(40);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[cancelModal.backdrop, { opacity: fadeAnim }]}>
        <Animated.View style={[cancelModal.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Close button */}
          <TouchableOpacity style={cancelModal.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={16} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>

          {/* Warning icon */}
          <View style={cancelModal.iconWrap}>
            <AlertTriangle size={28} color={RED} strokeWidth={1.5} />
          </View>

          {step === 1 ? (
            <>
              <Text style={cancelModal.title}>Cancel this trip?</Text>
              <Text style={cancelModal.body}>
                Cancelling may incur a fee depending on how close the pickup time is. This action
                cannot be undone.
              </Text>

              <TouchableOpacity
                style={cancelModal.primaryBtn}
                onPress={onFirstConfirm}
                activeOpacity={0.8}>
                <Text style={cancelModal.primaryBtnText}>Yes, continue</Text>
              </TouchableOpacity>

              <TouchableOpacity style={cancelModal.ghostBtn} onPress={onClose} activeOpacity={0.7}>
                <Text style={cancelModal.ghostBtnText}>Keep my trip</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={cancelModal.title}>Are you sure?</Text>
              <Text style={cancelModal.body}>
                This is your final confirmation. Your booking will be permanently cancelled and your
                driver will be notified.
              </Text>

              <TouchableOpacity
                style={[cancelModal.primaryBtn, cancelModal.primaryBtnDanger]}
                onPress={onFinalConfirm}
                activeOpacity={0.8}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={cancelModal.primaryBtnText}>Cancel my booking</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={cancelModal.ghostBtn}
                onPress={onClose}
                activeOpacity={0.7}
                disabled={loading}>
                <Text style={cancelModal.ghostBtnText}>Go back</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const cancelModal = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 12,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: RED_12,
    borderWidth: 1,
    borderColor: RED_22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  body: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 50,
  },
  primaryBtnDanger: {
    backgroundColor: RED,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  ghostBtn: {
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
});
