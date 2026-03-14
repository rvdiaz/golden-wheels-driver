import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const BodyWrapper = ({
  children,
  gradientCoverage = 1.4,
  backgroundImageSource,
  imageHeight = 0.55, // fraction of screen the image covers before dissolving
}: {
  children: React.ReactNode;
  gradientCoverage?: number;
  backgroundImageSource?: {
    uri: string;
  };
  imageHeight?: number; // 0.0 → 1.0
}) => {
  return (
    <View style={styles.root}>
      {/* ── Background image (optional) — sits at the top, dissolves into gradient ── */}
      {backgroundImageSource ? (
        <View style={[styles.imageContainer, { height: `${imageHeight * 100}%` as any }]}>
          <ImageBackground
            source={backgroundImageSource}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {/* Top dark overlay for readability */}
          <LinearGradient
            colors={['rgba(2,6,23,0.75)', 'rgba(2,6,23,0.65)', 'rgba(2,6,23,0.85)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Dissolve: sides + bottom melt into the gradient */}
          <LinearGradient
            colors={['transparent', '#020617'] as [string, string]}
            start={{ x: 0.5, y: 0.45 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : (
        <LinearGradient
          colors={['#1c2742', '#090d14', '#000'] as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: gradientCoverage }}
          style={StyleSheet.absoluteFill}
          // Lower opacity so the image shows through at the top
          pointerEvents="none"
        />
      )}

      {/* ── Overlay gradient when image is present: transparent top → opaque bottom ── */}
      {backgroundImageSource && (
        <LinearGradient
          colors={['transparent', '#020617'] as [string, string]}
          start={{ x: 0.5, y: imageHeight * 0.6 }}
          end={{ x: 0.5, y: imageHeight }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
