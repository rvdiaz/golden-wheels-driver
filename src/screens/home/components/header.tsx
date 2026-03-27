import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '~/codidge_components/UI/text';
import { BookSelectionForm } from '~/components/bookTripJourney';
import { GlassButton } from '~/codidge_components/UI/button/GlassButton';
import { ButtonSize } from '~/codidge_components/UI/button/types';
import { ChevronRight } from 'lucide-react-native';
const { width } = Dimensions.get('window');
const HEIGHT = width * 0.92; // ~62vw tall, feels cinematic

export const HeaderCallToAction = ({
  imageUri,
  title = 'Discover Your Next Adventure',
  subtitle = 'Curated trips for every traveler',
  buttonLabel = 'Book a Trip',
  onPress,
}: {
  imageUri?: string;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  onPress?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={
          imageUri ? { uri: imageUri } : require('/assets/header.jpeg') // swap for your asset
        }
        style={styles.image}
        resizeMode="cover">
        {/* Top fade — blends image into the dark gradient behind BodyWrapper */}
        <LinearGradient
          colors={
            ['#111827', 'rgba(0,0,0,0.0)', 'rgba(0,0,0,0)', 'transparent'] as [
              string,
              string,
              string,
              string,
            ]
          }
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topFade}
        />
        {/* Bottom blur + dark fade — text lives here */}
        <View style={styles.bottomSection}>
          <LinearGradient
            colors={
              ['transparent', 'rgba(0,0,0,0.72)', '#020617', '#020617', '#020617', '#020617'] as [
                string,
                string,
                string,
                string,
                string,
                string,
              ]
            }
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Text + CTA */}
          <View style={styles.content}>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Text style={styles.title}>{title}</Text>
            {/* Trigger button inside the card */}
            <GlassButton
              size={ButtonSize.XLARGE}
              title={buttonLabel}
              onPress={() => setOpen(true)}
              rightIcon={<ChevronRight size={20} color="#fff" />}
              style={{ width: '70%' }}
            />
          </View>
        </View>
      </ImageBackground>
      <Modal
        visible={open}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}>
        <BookSelectionForm
          onDismiss={() => setOpen(false)}
          onPayPress={(data) => {
            setOpen(false);
            // handle payment
          }}
        />
      </Modal>
    </View>
  );
};

const BOTTOM_HEIGHT = 160;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    // card shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  // ── Top fade — merges with BodyWrapper gradient ──────────────────────────
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEIGHT,
  },

  // ── Bottom blurred section ───────────────────────────────────────────────
  bottomSection: {
    height: BOTTOM_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },

  // ── Text ─────────────────────────────────────────────────────────────────
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: 'rgba(218,192,114,0.85)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
    marginTop: 3,
  },
});
