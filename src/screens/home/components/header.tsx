import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';

const { width } = Dimensions.get('window');
const HEIGHT = width * 0.82; // ~62vw tall, feels cinematic

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
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={
          imageUri ? { uri: imageUri } : require('/assets/header.jpg') // swap for your asset
        }
        style={styles.image}
        resizeMode="cover">
        {/* Top fade — blends image into the dark gradient behind BodyWrapper */}
        <LinearGradient
          colors={
            ['#111827', 'rgba(0,0,0,0.42)', 'rgba(0,0,0,0.72)', 'transparent'] as [
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

            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.button}>
              {/* Golden gradient button */}
              <LinearGradient
                colors={['#dac072', '#b8965a'] as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.buttonLabel}>{buttonLabel}</Text>
              <ChevronRight size={18} color="#1a1208" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const BOTTOM_HEIGHT = 160;
const BUTTON_H = 48;

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
    gap: 6,
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
    marginBottom: 4,
  },

  // ── Button ───────────────────────────────────────────────────────────────
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: BUTTON_H,
    paddingHorizontal: 28,
    borderRadius: BUTTON_H / 2,
    overflow: 'hidden',
    marginTop: 4,
    // subtle inner shadow via border
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1208', // dark brown on gold
    letterSpacing: 0.3,
  },
});
