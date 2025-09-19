import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '~/codidge_components/UI/card';

export const DashboardBottomHeader = () => {
  const [open, setOpen] = useState(true);

  if (!open) {
    return;
  }

  return (
    <Card style={styles.bannerCard}>
      <View style={styles.bannerContent}>
        {/* Replace the text block with an image */}
        <Image source={require('assets/home-hand.png')} style={styles.bannerImage} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View style={{ width: '88%', gap: 10 }}>
            <Text style={styles.quoteText} numberOfLines={2}>
              “Every expert was once a beginner. Every pro was once an amateur”
            </Text>
            <Text style={styles.quoteText}>Robin Sharma</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setOpen((op) => !op);
            }}
            style={styles.bannerButton}>
            <X color={'#CBCFF0'} size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    marginBottom: 10,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#39238A',
    paddingVertical: 10,
  },
  bannerImage: {
    width: 73, // adjust size to your design
    height: 63,
    marginRight: 12,
    marginLeft: -12,
  },
  bannerText: {
    flex: 1,
  },
  quoteText: {
    color: '#CBCFF0',
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
    padding: 2,
    flex: 1,
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
