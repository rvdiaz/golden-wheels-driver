import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  ScrollView,
} from 'react-native';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;

  // Content
  children: React.ReactNode;

  // Optional header
  title?: string;
  /** Replaces the default title+close row entirely */
  renderHeader?: () => React.ReactNode;
  /** Hide the close button (e.g. if renderHeader handles it) */
  hideClose?: boolean;

  // Layout
  /** 0–1 fraction of screen height. Default 0.82 */
  heightFraction?: number;
  /** Extra style on the scroll content container */
  contentStyle?: StyleProp<ViewStyle>;
  /** Pass false to disable scroll (e.g. when child manages its own scroll) */
  scrollable?: boolean;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onClose,
  children,
  title,
  renderHeader,
  hideClose = false,
  heightFraction = 0.82,
  contentStyle,
  scrollable = true,
}) => {
  const sheetHeight = SCREEN_HEIGHT * heightFraction;
  const slideAnim = useRef(new Animated.Value(sheetHeight)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 160,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: sheetHeight,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const inner = scrollable ? (
    <ScrollView
      style={sheet.scroll}
      contentContainerStyle={[sheet.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[sheet.scrollContent, contentStyle]}>{children}</View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[sheet.backdrop, { opacity: backdropAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[sheet.container, { height: sheetHeight, transform: [{ translateY: slideAnim }] }]}
        pointerEvents="box-none">
        {/* iOS blur */}
        {Platform.OS === 'ios' && (
          <BlurView
            intensity={60}
            tint="dark"
            style={[StyleSheet.absoluteFill, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}
          />
        )}

        {/* Dark gradient */}
        <LinearGradient
          colors={['rgba(2,6,23,0.92)', 'rgba(2,6,23,0.97)']}
          style={[StyleSheet.absoluteFill, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}
        />

        {/* Gold top border */}
        <LinearGradient
          colors={['transparent', theme.colors.primary, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={sheet.topBorder}
        />

        {/* Header row */}
        {renderHeader ? (
          renderHeader()
        ) : (
          <View style={sheet.header}>
            {title ? (
              <Text style={sheet.title}>{title}</Text>
            ) : (
              <View /> /* spacer so close button stays right-aligned */
            )}
            {!hideClose && (
              <TouchableOpacity onPress={onClose} style={sheet.closeBtn} activeOpacity={0.7}>
                <X size={18} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {inner}
      </Animated.View>
    </Modal>
  );
};

const sheet = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(2,6,23,0.97)' : 'transparent',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginBottom: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
