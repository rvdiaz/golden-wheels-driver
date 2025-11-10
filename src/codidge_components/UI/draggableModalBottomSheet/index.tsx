import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DraggableBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // Percentage of screen height (0.5 = 50%, 0.9 = 90%)
  initialSnapIndex?: number;
}

export const DraggableBottomSheet: React.FC<DraggableBottomSheetProps> = ({
  visible,
  onClose,
  children,
  snapPoints = [0.5, 0.9], // Default: 50% and 90% of screen height
  initialSnapIndex = 0,
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const lastGestureDy = useRef(0);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnapIndex);

  // Convert snap points from percentages to pixel values
  const snapPointsPixels = snapPoints.map((point) => SCREEN_HEIGHT * (1 - point));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Store the current position when gesture starts
        translateY.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);
        lastGestureDy.current = gestureState.dy;
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();

        // Determine velocity and direction
        const velocity = gestureState.vy;
        const currentY = snapPointsPixels[currentSnapIndex] + gestureState.dy;

        // If dragged down with enough velocity or distance, close the sheet
        if (velocity > 0.5 || (gestureState.dy > 100 && currentSnapIndex === 0)) {
          closeSheet();
          return;
        }

        // Find the nearest snap point
        let closestSnapIndex = 0;
        let minDistance = Math.abs(currentY - snapPointsPixels[0]);

        for (let i = 1; i < snapPointsPixels.length; i++) {
          const distance = Math.abs(currentY - snapPointsPixels[i]);
          if (distance < minDistance) {
            minDistance = distance;
            closestSnapIndex = i;
          }
        }

        // Consider velocity for snapping
        if (Math.abs(velocity) > 0.3) {
          if (velocity < 0 && closestSnapIndex < snapPointsPixels.length - 1) {
            // Swiping up fast - go to next higher snap point
            closestSnapIndex++;
          } else if (velocity > 0 && closestSnapIndex > 0) {
            // Swiping down fast - go to next lower snap point
            closestSnapIndex--;
          }
        }

        snapToPoint(closestSnapIndex);
      },
    })
  ).current;

  const snapToPoint = (snapIndex: number) => {
    setCurrentSnapIndex(snapIndex);
    Animated.spring(translateY, {
      toValue: snapPointsPixels[snapIndex],
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  };

  const openSheet = () => {
    Animated.spring(translateY, {
      toValue: snapPointsPixels[initialSnapIndex],
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      setCurrentSnapIndex(initialSnapIndex);
    });
  };

  useEffect(() => {
    if (visible) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [visible]);

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeSheet} />

        {/* Bottom Sheet - Now the entire sheet is draggable */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}>
          {/* Drag Handle - Still visible but not the only draggable area */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          {/* Content */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
