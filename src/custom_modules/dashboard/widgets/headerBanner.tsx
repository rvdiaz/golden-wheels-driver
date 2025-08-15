import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';

export const HeaderBanner = () => {
  return (
    <Card style={styles.bannerCard}>
      <View style={styles.bannerContent}>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>My potential is limitless.</Text>
          <Text style={styles.bannerSubtitle}>Daily Affirmation • August 7, 2024</Text>
        </View>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>New Quote</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#2563EB',
    /* backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #059669 100%)', */
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bannerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
